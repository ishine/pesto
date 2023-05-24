import { FC, useEffect, useRef, useState } from "react";
import { AudioDataFromServerState } from "../types/AudioDataFromServer";
import * as Tone from "tone";
import {
  AudioPlayerInitialState,
  AudioPlayerState,
} from "../types/AudioPlayerState";
import useSynth from "../ToneLib/useSynth";
import "./AudioFrequencyPlayer.css";
import LoadingAnimation from "../LoadingAnimation/LoadingAnimation";

interface AudioFrequencyPlayerProps {
  audioData: AudioDataFromServerState;
}

const AudioFrequencyPlayer: FC<AudioFrequencyPlayerProps> = ({ audioData }) => {
  const [audioPlayerState, setAudioPlayerState] = useState<AudioPlayerState>(
    AudioPlayerInitialState
  );
  const synth = useSynth({
    envelope: {
      attack: 0.5,
    },
  });
  const seqRef = useRef<Tone.Sequence | null>(null);

  useEffect(() => {
    if (audioData.isSuccessFetching && audioData.data.length !== 0)
      seqRef.current = new Tone.Sequence(
        (time, { frequency, confidence }) => {
          if (confidence > 0.8) {
            synth.triggerAttackRelease(frequency, 0.1, time);
          }
        },
        audioData.data,
        0.01
      ).start(0);
    return () => {
      seqRef.current?.dispose();
    };
  }, [audioData.isSuccessFetching, audioData.data, synth]);

  useEffect(() => {
    if (audioData.isSuccessFetching && audioData.data.length !== 0) {
      console.log(audioData.data);
    }
  }, [audioData.isSuccessFetching, audioData.data]);

  const handleButtonClick = async () => {
    if (Tone.Transport.state === "started") {
      Tone.Transport.stop();
      setAudioPlayerState((state) => {
        return { ...state, isPlaying: false };
      });
    } else {
      await Tone.start();
      Tone.Transport.start();
      setAudioPlayerState((state) => {
        return { ...state, isPlaying: true };
      });
    }
  };

  return (
    <div className="audio-frequency-player-border-container">
      <div className="audio-frequency-player-main-container">
        {audioData.isLoadingFetching ? (
          <LoadingAnimation />
        ) : (
          <button
            className="audio-frequency-player-play-button"
            onClick={() => handleButtonClick()}
          >
            {audioPlayerState.isPlaying ? "Pause" : "Play"}
          </button>
        )}
      </div>
    </div>
  );
};

export default AudioFrequencyPlayer;
