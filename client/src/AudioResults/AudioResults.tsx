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
      <AudioFrequencyPlayer
        audioData={audioData}
        audioPlayerState={audioPlayerState}
        setAudioPlayerState={setAudioPlayerState} />
      <FrequenceRoll
        audioData={audioData}
        audioPlayerState={audioPlayerState} />
    </div>
  );
};

export default AudioResults;
