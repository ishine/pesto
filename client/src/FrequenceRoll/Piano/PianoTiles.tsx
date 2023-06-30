import React, { FC, useMemo } from "react";
import { AudioDataFromServerState } from "../../types/AudioDataFromServer";

interface PianoTilesProps {
  audioData: AudioDataFromServerState;
  confidence: number;
  height: number;
  width: number;
}

const PianoTiles: FC<PianoTilesProps> = ({
                                           audioData,
                                           confidence,
                                           height,
                                           width,
                                         }) => {
  const confidenceValidatedTones = useMemo(() => {
    return audioData.data.filter((data) => data.confidence >= confidence);
  }, [audioData, confidence]);

  const tones = useMemo(() => {
    return confidenceValidatedTones.map((data) => data.tone);
  }, [confidenceValidatedTones]);

  const maxTone = useMemo(() => {
    return tones.reduce((max, data) => (data > max ? data : max), -Infinity);
  }, [tones]);

  const lowestTone = useMemo(() => {
    return tones.reduce((min, data) => (data < min ? data : min), Infinity);
  }, [tones]);

  const rangeOfTone = useMemo(() => {
    return Math.floor(maxTone) - Math.floor(lowestTone);
  }, [maxTone, lowestTone]);

  const blockWidth = 35;
  const blockHeight = useMemo(() => {
    return height / rangeOfTone;
  }, [height, rangeOfTone]);

  const rangeOfTonesHeight = useMemo(() => {
    return rangeOfTone * blockHeight;
  }, [rangeOfTone, blockHeight]);

  const renderRectsWithLines = () => {
    const rectsAndLines = [];

    for (let i = 0; i < rangeOfTone; i++) {
      const rectX = 0;
      const rectY = i * blockHeight;
      const rectWidth = blockWidth;
      const rectHeight = blockHeight;

      // Add the <rect> element to the array
      rectsAndLines.push(
        <rect
          className="piano-roll-tile-rect"
          key={`rect-${i}`}
          x={rectX}
          y={rectY}
          width={rectWidth}
          height={rectHeight}
          fill="white"
          stroke="black"
          strokeWidth={1}
        />
      );
    }

    return rectsAndLines;
  };

  return (
    <div className="piano-tiles-container">
      <svg height={rangeOfTonesHeight} width={blockWidth}>
        {renderRectsWithLines()}
      </svg>
    </div>
  );
};

export default PianoTiles;
