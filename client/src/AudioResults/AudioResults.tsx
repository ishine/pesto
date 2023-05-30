import {FC, useState} from "react";
import "./AudioResults.css";
import { AudioDataFromServerState } from "../types/AudioDataFromServer";
import AudioFrequencyPlayer from "../AudioPlayer/AudioFrequencyPlayer";
import FrequenceRoll from "../FrequenceRoll/FrequenceRoll";
import {AudioPlayerInitialState, AudioPlayerState} from "../types/AudioPlayerState";

interface AudioResultsProps {
  audioData: AudioDataFromServerState;
}

const AudioResults: FC<AudioResultsProps> = ({ audioData }) => {
  const [audioPlayerState, setAudioPlayerState] = useState<AudioPlayerState>(
    AudioPlayerInitialState
  );

  return (
    <div className="audio-results-main-container">
      <FrequenceRoll
        audioData={audioData}
        audioPlayerState={audioPlayerState} />
      <AudioFrequencyPlayer
        audioData={audioData}
        audioPlayerState={audioPlayerState}
        setAudioPlayerState={setAudioPlayerState} />
    </div>
  );
};

export default AudioResults;
