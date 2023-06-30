import {AudioDataFromServerState} from "../../types/AudioDataFromServer";
import React, {FC, useCallback, useEffect, useMemo, useRef} from "react";
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

  const renderLines = () => {
    const lines = [];

    for (let i = 0; i < rangeOfTone; i++) {
      const rectY = i * blockHeight;

      lines.push(
        <line
          className="frequence-roll-piano-note-line"
          key={`line-${i}`}
          x1={0}
          x2={rangeOfNotesWidth}

          y1={rectY}
          y2={rectY}

          stroke="#ffffff"
          strokeWidth={1}
        />
      );
    }

    return lines;
  }

  const renderRects = () => {
    const rects = [];

    for (let i = 0; i < confidenceValidatedTones.length; i++) {
      const data = confidenceValidatedTones[i];
      const rectX = (data.index * blockWidth) + blockWidth;
      const rectY = (Math.floor(maxTone - data.tone) * blockHeight) + 0.7;
      const rectWidth = blockWidth;
      const rectHeight = blockHeight;

      rects.push(
        <rect
          className="frequence-roll-piano-note-rect"
          key={data.index}
          x={rectX}
          y={rectY}
          width={
          data.third === (0).toPrecision(4)
            ? rectWidth
            : data.third === (1 / 3).toPrecision(4)
              ? rectWidth
              : data.third === (2 / 3).toPrecision(4)
                ? rectWidth
                : 0.1
          }
          height={rectHeight - 2}
          fill={
          data.third === (0).toPrecision(4)
            ? "url(#top-third)"
            : data.third === (1 / 3).toPrecision(4)
              ? "url(#mid-third)"
              : data.third === (2 / 3).toPrecision(4)
                ? "url(#bottom-third)"
                : "rgba(63,64,61,1)"
          }
        />
      );
    }

    return rects;
  };

  // RENDERING OF THE PIANO ROLL COMPONENT
  return (
    <div ref={pianoRollContainerRef} className="piano-roll-container">
      <svg height={rangeOfTonesHeight} width={rangeOfNotesWidth} >
        <defs>
          <linearGradient id="top-third" gradientTransform="rotate(90)">
            <stop offset="5%" stopColor="rgba(116, 180, 63, 1)" />
            <stop offset="33%" stopColor="rgba(116, 180, 63, 1)" />
            <stop offset="33%" stopColor="rgba(63,64,67,1)" />
            <stop offset="100%" stopColor="rgba(63,64,67,1)" />
          </linearGradient>
          <linearGradient id="mid-third" gradientTransform="rotate(90)">
            <stop offset="0%" stopColor="rgba(63,64,67,1)" />
            <stop offset="33%" stopColor="rgba(63,64,67,1)" />
            <stop offset="33%" stopColor="rgba(57, 113, 11, 1)" />
            <stop offset="67%" stopColor="rgba(57, 113, 11, 1)" />
            <stop offset="67%" stopColor="rgba(63,64,67,1)" />
            <stop offset="100%" stopColor="rgba(63,64,67,1)" />
          </linearGradient>
          <linearGradient id="bottom-third" gradientTransform="rotate(90)">
            <stop offset="0%" stopColor="rgba(63,64,67,1)" />
            <stop offset="67%" stopColor="rgba(63,64,67,1)" />
            <stop offset="67%" stopColor="rgba(65, 101, 81, 0.7)" />
            <stop offset="100%" stopColor="rgba(65, 101, 81, 0.7)" />
          </linearGradient>
        </defs>

        {renderLines()}
        {renderRects()}

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
