import { FC } from "react";
import {AudioDataFromServerState} from "../../types/AudioDataFromServer";

interface PianoTilesProps {
  audioData: AudioDataFromServerState;
  confidence: number;

  height: number;
  width: number;
}

const PianoTiles: FC<PianoTilesProps> = ({ audioData, confidence, height, width }) => {
  const confidenceValidatedTones = audioData.data.filter(
    (data) => data.confidence >= confidence
  );

  const tones = confidenceValidatedTones.map((data) => data.tone);

  const maxTone = tones.reduce((max, data) => (data > max ? data : max), -Infinity);
  const lowestTone = tones.reduce((min, data) => (data < min ? data : min), Infinity);

  const blockWidth = 15;
  const blockHeight = 10;

  const rangeOfTone = Math.floor(maxTone) - Math.floor(lowestTone)
  const rangeOfTonesHeight = rangeOfTone * blockHeight;

  return (
    <div className="piano-tiles-container" >
      <svg height={rangeOfTonesHeight} width={blockWidth} >
        {Array.from({ length: rangeOfTone }).map((_, index) => {
          const rectWidth = blockWidth;
          const rectHeight = blockHeight;
          const rectX = 0;
          const rectY = index * blockHeight;

          return (
            <rect
              className="piano-roll-tile-rect"
              key={index}

              x={rectX} y={rectY}
              width={rectWidth} height={rectHeight}

              fill={'white'}
              stroke={"black"} strokeWidth={1}
            />
          );
        })}
      </svg>
    </div>
  );
};

export default PianoTiles;
