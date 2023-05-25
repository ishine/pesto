import { FC } from "react";
import "./AudioResults.css";
import { AudioDataFromServerState } from "../types/AudioDataFromServer";
import AudioFrequencyPlayer from "../AudioPlayer/AudioFrequencyPlayer";
import FrequenceRoll from "../FrequenceRoll/FrequenceRoll";

interface AudioResultsProps {
  audioData: AudioDataFromServerState;
}

const AudioResults: FC<AudioResultsProps> = ({ audioData }) => {
  return (
    <div className="audio-results-main-container">
      <AudioFrequencyPlayer audioData={audioData} />
      <FrequenceRoll audioData={audioData} />
    </div>
  );
};

export default AudioResults;
