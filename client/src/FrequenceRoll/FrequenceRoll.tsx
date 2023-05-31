import {
  FC, RefObject,
  useCallback,
  useEffect, useMemo,
  useRef,
  useState,
} from "react";
import { AudioDataFromServerState } from "../types/AudioDataFromServer";
import "./FrequenceRoll.css";
import * as Tone from "tone";
import LoadingAnimation from "../UI/LoadingAnimation";
import RoundedTextInfo from "../UI/RoundedTextInfo";

interface FrequenceRollProps {
  audioData: AudioDataFromServerState;
}

interface PianoRollProps {
  audioData: AudioDataFromServerState;

  height: number;
  width: number;

  time: number;
}

const PianoRoll: FC<PianoRollProps> = ({ audioData, height, width, time }) => {
  const pianoColumnRollPadding = 2;
  const confidence = 0.8;
  const blockWidth = 1.5;
  const blockHeight = 10;
  const totalWidth = width;

  const newData = audioData.data.map((data, index) => {
    return {
      index: index,
      frequency: data.frequency,
      tone: data.tone,
      confidence: data.confidence,
    };
  });

  const newDataFiltered = newData.filter(
    (data) => data.confidence >= confidence
  );

  const tones = audioData.data.map((data) => data.tone);
  const confidences = audioData.data.map((data) => data.confidence);

  const confidenceValidatedTones = tones.filter(
    (_, i) => confidences[i] > confidence
  );

  const toneMax = Math.ceil(
    Math.max(...confidenceValidatedTones) + pianoColumnRollPadding
  );
  const toneMin = Math.floor(
    Math.min(...confidenceValidatedTones) - pianoColumnRollPadding
  );
  const nbOfTones = toneMax - toneMin;
  const totalHeight = useMemo(() => {
    return nbOfTones * blockHeight + (blockHeight * 4);
  }, [nbOfTones, blockHeight])

  const lineRef = useRef<any>();
  const animation = useRef<any>();

  const animateLine = useCallback(() => {
    const lineElement = lineRef.current;

    if (lineElement != null) {
      lineElement.setAttribute('x1', (time * blockWidth).toString());
      lineElement.setAttribute('x2', (time * blockWidth).toString());
      animation.current = requestAnimationFrame(animateLine);
    }
  }, [time]);

  useEffect(() => {
    if (Tone.Transport.state === "started") {
      animation.current = requestAnimationFrame(animateLine);
    } else {
      cancelAnimationFrame(animation.current);
    }
  }, [animateLine, time]);

  return (
    <svg width={totalWidth} height={height * 0.9} >
    {newDataFiltered.map((data) => {
      const invertedValue = 128 - Math.floor(data.tone);
      const rectWidth = blockWidth;
      const rectHeight = blockHeight;
      const rectX = (data.index * blockWidth);
      const rectY = (invertedValue - toneMin) * blockHeight + (blockHeight / 2) - (rectHeight / 2) + ((height * 0.9) / 2);

      return (
        <rect
          className="frequence-roll-piano-note-rect"
          key={data.index}
          x={rectX} y={rectY}
          width={rectWidth} height={rectHeight}
          fill={'rgba(161,13,161,0.5)'}
          stroke={"green"} strokeWidth={1}
        />
      );
    })}

      <line
          ref={lineRef}
          x1={time * blockWidth} x2={time * blockWidth}
          y1={0} y2="100%"
          stroke="red" strokeWidth={2}
      />

      <line x1={0} y1="50%" x2={totalWidth} y2="50%" stroke="red" strokeWidth={0.5}/>

      {Array((width / blockWidth)).fill(null).map((_, index) => {
        return <line
            key={index}
            x1={index * blockWidth * 100} x2={index * blockWidth * 100}
            y1={"95%"} y2="100%"
            fill="white"
            stroke={"white"} strokeWidth={2}
        />
      })}
      {Array((width / blockWidth)).fill(null).map((_, index) => {
        return <line
            key={index}
            x1={index * blockWidth * 10} x2={index * blockWidth * 10}
            y1={"98%"} y2="100%"
            fill="white"
            stroke={"white"} strokeWidth={1}
        />
      })}
  </svg>
  );
};

const FrequenceRoll: FC<FrequenceRollProps> = ({
  audioData,
}) => {
  const [time, setTime] = useState<number>(0);

  useEffect(() => {
    Tone.Transport.scheduleRepeat(() => {
      setTime(Tone.Transport.seconds * 95);
    }, 0.01)
  }, []);

  const frequenceRollBorderMainContainer = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState<number>(0);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  useEffect(() => {
    if (frequenceRollBorderMainContainer.current != null && audioData.isSuccessFetching) {
      const divHeight = frequenceRollBorderMainContainer.current.offsetHeight;
      const divWidth = frequenceRollBorderMainContainer.current.offsetWidth;
      console.log("The height of the frequenceRollBorderMainContainer div in pixels is: " + divHeight + "px by " + divWidth + "px");
      setContainerHeight(divHeight);
      setContainerWidth(divWidth)
    } else {
      console.log("it's null");
    }
  }, [
      frequenceRollBorderMainContainer.current?.offsetHeight,
      frequenceRollBorderMainContainer.current?.offsetWidth,
      audioData.isSuccessFetching
  ]);

  return (
    <div ref={frequenceRollBorderMainContainer} className="frequence-roll-border-container">
      <div className="frequence-roll-main-container">
        {audioData.isLoadingFetching ? (
          <LoadingAnimation />
        ) : audioData.data.length !== 0 ? (
          <div className="frequence-roll-piano-notes-container">
              <PianoRoll audioData={audioData} height={containerHeight} width={containerWidth} time={time} />
          </div>
        ) : (
          <RoundedTextInfo text="Waiting for a file ..." />
        )}
      </div>
    </div>
  );
};

export default FrequenceRoll;
