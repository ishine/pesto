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
  const blockWidth = 1.5;
  const blockHeight = 10;

  const indexedAudioData = audioData.data.map((data, index) => {
    return {
      index: index,

      frequency: data.frequency,
      tone: data.tone,
      confidence: data.confidence,
    };
  });

  const confidenceValidatedTones = indexedAudioData.filter(
    (data) => data.confidence >= confidence
  );

  const tones = confidenceValidatedTones.map((data) => data.tone);
  const confidences = confidenceValidatedTones.map((data) => data.confidence);

  const maxTone = tones.reduce((max, data) => (data > max ? data : max), -Infinity);
  const lowestTone = tones.reduce((min, data) => (data < min ? data : min), Infinity);

  const rangeOfTone = Math.floor(maxTone) - Math.floor(lowestTone)
  const rangeOfTonesHeight = rangeOfTone * blockHeight;
  const rangeOfNotesWidth = audioData.data.length * blockWidth;

  // ANIMATION OF THE TIME PROGRESS BAR USING REFs AND REQUEST ANIMATION FRAME
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

  // RENDERING OF THE PIANO ROLL COMPONENT
  return (
    <div className="piano-roll-container">
      <svg height={rangeOfTonesHeight} width={rangeOfNotesWidth} >

        {confidenceValidatedTones.map((data) => {
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

        <line
            x1={0} x2={rangeOfNotesWidth}
            y1="50%" y2="50%"
            stroke="red" strokeWidth={0.5}
        />
      </svg>
    </div>
  );
};

export default PianoRoll;
