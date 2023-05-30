import {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { AudioDataFromServerState } from "../types/AudioDataFromServer";
import "./FrequenceRoll.css";
import { CircularProgress, Slider } from "@mui/material";
import * as Tone from "tone";
import { AudioPlayerState } from "../types/AudioPlayerState";
import LoadingAnimation from "../UI/LoadingAnimation";
import RoundedTextInfo from "../UI/RoundedTextInfo";

interface FrequenceRollProps {
  audioData: AudioDataFromServerState;

  audioPlayerState: AudioPlayerState;
}

interface PianoRollProps {
  audioData: AudioDataFromServerState;
  time: number;
}

const PianoRoll: FC<PianoRollProps> = ({ audioData, time }) => {
  const confidence = 0.8;
  const pianoColumnRollPadding = 2;

  const tones = audioData.data.map((data) => data.tone);
  const confidences = audioData.data.map((data) => data.confidence);

  const confidenceValidatedTones = tones.filter(
    (_, i) => confidences[i] > confidence
  );

  const width = tones.length;
  const toneMax = Math.ceil(
    Math.max(...confidenceValidatedTones) + pianoColumnRollPadding
  );
  const toneMin = Math.floor(
    Math.min(...confidenceValidatedTones) - pianoColumnRollPadding
  );
  const nbOfTones = toneMax - toneMin;

  // Calculate the dimensions based on the number of rows (W) and columns (T)
  const numRows = nbOfTones;
  const numCols = width + 1;

  const [cells, setCells] = useState<any[]>([]);

  const getToneThird = (row: number, index: number, tone: number) => {
    if (
      Math.floor(tone) === Math.floor(row + toneMin) &&
      confidences[index] > confidence
    ) {
      return (tone - Math.floor(tone)).toPrecision(4);
    }

    return "1";
  };

  useEffect(() => {
    const newCells = [];

    const handleClick = (key: any) => {
      console.log(key);
    };

    for (let row = numRows; row > 0; row--) {
      const rowCells = (
        <tr key={`row-${row + toneMin}`}>
          <td className="darkgrey-cell">
            <div className="cell-text">{row + toneMin}</div>
          </td>
          {tones.map((tone, column) => (
            <td
              key={`column-${column * 0.01}`}
              className={
                getToneThird(row, column, tone) === (0).toPrecision(4)
                  ? "magenta-cell-first-third"
                  : getToneThird(row, column, tone) === (1 / 3).toPrecision(4)
                  ? "magenta-cell-second-third"
                  : getToneThird(row, column, tone) === (2 / 3).toPrecision(4)
                  ? "magenta-cell-third-third"
                  : "white-cell"
              }
              onClick={() =>
                handleClick(
                  `time: ${column * 0.01} (in seconds) note: ${row + toneMin}`
                )
              }
            >
              {/* Cell content */}
            </td>
          ))}
        </tr>
      );

      newCells.push(rowCells);
    }

    setCells(newCells);
  }, [audioData, numRows, numCols]);

  return (
    <div>
      <table>
        <tbody>{cells}</tbody>
      </table>
    </div>
  );
};

const FrequenceRoll: FC<FrequenceRollProps> = ({
  audioData,
  audioPlayerState,
}) => {
  const [value, setValue] = useState<number>(0);

  const handleChange = (event: any, newValue: any) => {
    console.log(audioPlayerState.currentTime);
    setValue(newValue);
  };

  return (
    <div className="frequence-roll-border-container">
      <div className="frequence-roll-main-container">
        {audioData.isLoadingFetching ? (
          <LoadingAnimation />
        ) : audioData.data.length !== 0 ? (
          <div className="frequence-roll-piano-notes-container">
            <>
              <PianoRoll audioData={audioData} time={value} />
              {/* <Slider value={value} min={0} max={audioData.data.length} step={0.01} onChange={handleChange}/> */}
            </>
          </div>
        ) : (
          <RoundedTextInfo text="Waiting for a file ..." />
        )}
      </div>
    </div>
  );
};

export default FrequenceRoll;
