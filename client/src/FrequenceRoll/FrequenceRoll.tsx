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
  setAudioPlayerState: Dispatch<SetStateAction<AudioPlayerState>>;
}

interface PianoRollProps {
  audioData: AudioDataFromServerState;
}

const PianoRoll: FC<PianoRollProps> = ({ audioData }) => {
  const confidence = 0.7;
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

interface PianoRoll2Props {
  audioData: AudioDataFromServerState;
}

const PianoRoll2: FC<PianoRoll2Props> = ({ audioData }) => {
  const pianoColumnRollPadding = 2;
  const confidence = 0.8;
  const blockWidth = 5;
  const blockHeight = 5;
  const totalWidth = audioData.data.length * blockWidth;

  const newData = audioData.data.map((data, index) => {
    return {
      frequency: data.frequency,
      index: index,
      confidence: data.confidence,
      tone: data.tone,
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

  const width = tones.length;
  const toneMax = Math.ceil(
    Math.max(...confidenceValidatedTones) + pianoColumnRollPadding
  );
  const toneMin = Math.floor(
    Math.min(...confidenceValidatedTones) - pianoColumnRollPadding
  );
  const nbOfTones = toneMax - toneMin;

  console.log(newDataFiltered);

  return (
    <svg width={totalWidth} height="100%">
      {newDataFiltered.map((data) => (
        <rect
          key={data.index}
          x={data.index * blockWidth}
          y={(data.tone - toneMin) * blockHeight}
          width={10}
          height={10}
          fill="blue"
        />
      ))}
    </svg>
  );
};

const FrequenceRoll: FC<FrequenceRollProps> = ({
  audioData,
  audioPlayerState,
  setAudioPlayerState,
}) => {
  const [time, setTime] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(Tone.Transport.seconds);

      // console.log(Tone.Transport.seconds / 100, audioData.data.length)
      //
      // if (Tone.Transport.seconds / 95 > audioData.data.length && Tone.Transport.state === "started") {
      //   Tone.Transport.stop();
      //   setAudioPlayerState((state) => {
      //     return { ...state, isPlaying: false, currentTime: 0 };
      //   });
      // }

      // if ((Tone.Transport.seconds % (audioData.data.length / 100)) <= 0.1) {
      //   console.log("reset time bar");
      //   setTime(0);
      // } else {
      //   setTime((Tone.Transport.seconds % (audioData.data.length / 100)));
      // }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="frequence-roll-border-container">
      <div className="frequence-roll-main-container">
        {audioData.isLoadingFetching ? (
          <LoadingAnimation />
        ) : audioData.data.length !== 0 ? (
          <div className="frequence-roll-piano-notes-container">
            <PianoRoll2 audioData={audioData} />
            {/* <Slider
              value={time}
              min={0}
              max={audioData.data.length / 100}
              sx={{
                height: "100%",
                padding: 0,
                "& .MuiSlider-rail": {
                  opacity: 0,
                },
                "& .MuiSlider-track": {
                  display: "none",
                },
                "& .MuiSlider-thumb": {
                  height: "100%",
                  width: 3,
                  borderRadius: 0,
                  backgroundColor: "red",
                },
              }}
            /> */}
          </div>
        ) : (
          <RoundedTextInfo text="Waiting for a file ..." />
        )}
      </div>
    </div>
  );
};

export default FrequenceRoll;
