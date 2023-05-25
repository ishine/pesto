import { FC, useEffect, useRef } from "react";
import { AudioDataFromServerState } from "../types/AudioDataFromServer";
import "./FrequenceRoll.css";

interface FrequenceRollProps {
  audioData: AudioDataFromServerState;
}

const PianoRoll: FC<FrequenceRollProps> = ({audioData}) => {
  const step = 0.10;
  const confidence = 0.8;
  const pianoColumnRollPadding = 5

  const tones = audioData.data.map((data) => data.tone);
  const confidences = audioData.data.map((data) => data.confidence);

  const width = tones.length;
  const toneMax = Math.max(...tones) + pianoColumnRollPadding;
  const toneMin = Math.min(...tones) - pianoColumnRollPadding;
  const nbOfTones = toneMax - toneMin;

  // Calculate the dimensions based on the number of rows (W) and columns (T)
  const numRows = nbOfTones;
  const numCols = width;
  const cellWidth = 3;
  const cellHeight = 8;

  // Calculate the total width and height of the piano roll
  const pianoRollWidth = (numCols + 1) * cellWidth;
  const pianoRollHeight = numRows * cellHeight;

  // Create a canvas reference
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      const ctx = canvas.getContext('2d');

      // @ts-ignore
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
          const x = col * cellWidth; // Add 1 to skip the new column
          const y = row * cellHeight;

          if (Math.floor(tones[col]) == Math.floor(row + toneMin) && confidences[col] > confidence ) {
              // @ts-ignore
              ctx.fillStyle = 'magenta';
              // @ts-ignore
              ctx.fillRect(x, y, cellWidth, cellHeight);
          } else {
              // @ts-ignore
              ctx.fillStyle = 'darkgrey';
              // @ts-ignore
              ctx.fillRect(x, y, cellWidth, cellHeight);
          }

          // Draw the grey border around the cell
          // @ts-ignore
          ctx.strokeStyle = 'lightgrey';
          // @ts-ignore
          ctx.lineWidth = 1;
          // @ts-ignore
          ctx.strokeRect(x, y, cellWidth, cellHeight);
        }
      }

      // // Draw the dark grey column
      // const darkGreyWidth = cellWidth;
      // const darkGreyHeight = numRows * cellHeight;
      // // @ts-ignore
      // ctx.fillStyle = 'darkgrey';
      // // @ts-ignore
      // ctx.fillRect(0, 0, darkGreyWidth, darkGreyHeight);
      //
      // // Draw the grey border around the cell
      // // @ts-ignore
      // ctx.strokeStyle = 'grey';
      // // @ts-ignore
      // ctx.lineWidth = 1;
      // // @ts-ignore
      // ctx.strokeRect(0, 0, cellWidth, cellHeight);

      // // Draw the row numbers starting from 5
      // const fontSize = 10;
      // // @ts-ignore
      // ctx.font = `${fontSize}px Arial`;
      // // @ts-ignore
      // ctx.fillStyle = 'white';
      // // @ts-ignore
      // ctx.textAlign = 'center';
      // // @ts-ignore
      // ctx.textBaseline = 'middle';
      // for (let row = 0; row < numRows; row++) {
      //   const x = cellWidth / 2;
      //   const y = row * cellHeight + cellHeight / 2;
      //
      //   const number = toneMin;
      //   // @ts-ignore
      //   ctx.fillText((Math.floor(number) + row).toString(), x, y);
      // }
    }
  }, [audioData, numRows, numCols, cellWidth, cellHeight]);

  return <canvas ref={canvasRef} width={pianoRollWidth} height={pianoRollHeight} />;
}

const FrequenceRoll: FC<FrequenceRollProps> = ({ audioData }) => {
  return (
    <div className="frequence-roll-border-container">
      <div className="frequence-roll-main-container">
          <div className="frequence-roll-piano-notes-container">
              <PianoRoll audioData={audioData} />
          </div>
      </div>
    </div>
  );
};

export default FrequenceRoll;
