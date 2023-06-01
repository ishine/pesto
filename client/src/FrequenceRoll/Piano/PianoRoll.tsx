import {AudioDataFromServerState} from "../../types/AudioDataFromServer";
import {FC, useCallback, useEffect, useMemo, useRef} from "react";
import * as Tone from "tone";

interface PianoRollProps {
  audioData: AudioDataFromServerState;
  confidence: number;

  height: number;
  width: number;

  time: number;
}

const PianoRoll: FC<PianoRollProps> = ({ audioData, confidence, height, width, time }) => {
  const indexedAudioData = useMemo(() => { return audioData.data.map((data, index) => {
    return {
      index: index,

      frequency: data.frequency,
      tone: data.tone,
      confidence: data.confidence,

      third: (data.tone - Math.floor(data.tone)).toPrecision(4)
    };
  })}, [audioData.data]);

  const confidenceValidatedTones = useMemo(() => { return indexedAudioData.filter(
    (data) => data.confidence >= confidence
  )}, [confidence, indexedAudioData]);

  const tones = useMemo(() => { return confidenceValidatedTones.map((data) => data.tone); }, [confidenceValidatedTones]);

  const maxTone = useMemo(() => { return tones.reduce((max, data) => (data > max ? data : max), -Infinity); }, [tones]);
  const lowestTone = useMemo(() => { return tones.reduce((min, data) => (data < min ? data : min), Infinity); }, [tones]);

  const rangeOfTone = useMemo(() => { return Math.floor(maxTone) - Math.floor(lowestTone) }, [lowestTone, maxTone]);

  const blockWidth = 2;
  const blockHeight = useMemo(() => { return height / rangeOfTone; }, [height, rangeOfTone]);

  const rangeOfTonesHeight = useMemo(() => { return rangeOfTone * blockHeight; }, [blockHeight, rangeOfTone]);
  const rangeOfNotesWidth = useMemo(() => { return audioData.data.length * blockWidth; }, [audioData.data.length]);

  // ANIMATION OF THE TIME PROGRESS BAR USING REFs AND REQUEST ANIMATION FRAME
  const lineRef = useRef<any>();
  const animation = useRef<any>();

  // FOCUS SCROLL ON TIME PROGRESS BAR USING A REF
  const pianoRollContainerRef = useRef<any>();

  const keepLineCentered = useCallback(() => {
    const element = pianoRollContainerRef.current?.querySelector(".piano-roll-time-line");

    if (element) {
      element.scrollIntoView({
        inline: "center"
      })
    }
  }, []);

  useEffect(() => {
    keepLineCentered();
  }, [keepLineCentered, lineRef, time])

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

  // RENDERING OF THE PIANO ROLL COMPONENT
  return (
    <div ref={pianoRollContainerRef} className="piano-roll-container">
      <svg height={rangeOfTonesHeight} width={rangeOfNotesWidth} >
        <defs>
          <linearGradient id="top-third" gradientTransform="rotate(90)">
            <stop offset="0%" stopColor="rgba(224,78,224,0.9)" />
            <stop offset="33%" stopColor="rgba(224,78,224,0.9)" />
            <stop offset="33%" stopColor="rgba(63,64,67,1)" />
            <stop offset="100%" stopColor="rgba(63,64,67,1)" />
          </linearGradient>
          <linearGradient id="mid-third" gradientTransform="rotate(90)">
            <stop offset="0%" stopColor="rgba(63,64,67,1)" />
            <stop offset="33%" stopColor="rgba(63,64,67,1)" />
            <stop offset="33%" stopColor="rgba(255, 0, 255, 0.7)" />
            <stop offset="67%" stopColor="rgba(255, 0, 255, 0.7)" />
            <stop offset="67%" stopColor="rgba(63,64,67,1)" />
            <stop offset="100%" stopColor="rgba(63,64,67,1)" />
          </linearGradient>
          <linearGradient id="bottom-third" gradientTransform="rotate(90)">
            <stop offset="0%" stopColor="rgba(63,64,67,1)" />
            <stop offset="67%" stopColor="rgba(63,64,67,1)" />
            <stop offset="67%" stopColor="rgba(161,13,161,0.5)" />
            <stop offset="100%" stopColor="rgba(161,13,161,0.5)" />
          </linearGradient>
        </defs>

        {useMemo(() => { return confidenceValidatedTones.map((data) => {
          const rectWidth = blockWidth;
          const rectHeight = blockHeight;
          const rectX = (data.index * blockWidth) + blockWidth;
          const rectY = Math.floor(maxTone - data.tone) * blockHeight;

          return (
            <rect
              className="frequence-roll-piano-note-rect"
              key={data.index}
              x={rectX} y={rectY}
              width={rectWidth} height={rectHeight}
              fill={(
                data.third === (0).toPrecision(4) ? "url(#top-third)" :
                  data.third === (1/3).toPrecision(4) ? "url(#mid-third)" :
                    data.third === (2/3).toPrecision(4) ? "url(#bottom-third)" :
                      "rgba(63,64,61,1)")}
            />
          );
        })}, [blockHeight, confidenceValidatedTones, maxTone])}

        <line
            ref={lineRef}
            className="piano-roll-time-line"
            x1={time * blockWidth} x2={time * blockWidth}
            y1={0} y2="100%"
            stroke="grey" strokeWidth={2}
        />
      </svg>
    </div>
  );
};

export default PianoRoll;
