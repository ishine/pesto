import { FC, useEffect, useRef, useState } from "react";
import { AudioDataFromServer } from "../types/AudioDataFromServer";
import * as Tone from "tone";
import {
  AudioPlayerInitialState,
  AudioPlayerState,
} from "../types/AudioPlayerState";
import useSynth from "../ToneLib/useSynth";
import { rawDataConstant } from "../constants/rawData";

interface AudioFequencyPlayerProps {
  audioData: AudioDataFromServer;
}

const AudioFequencyPlayer: FC<AudioFequencyPlayerProps> = ({ audioData }) => {
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
    seqRef.current = new Tone.Sequence(
      (time, { frequency, confidence }) => {
        if (confidence > 0.8) {
          synth.triggerAttackRelease(frequency, 0.1, time);
        }
      },
      rawDataConstant,
      0.01
    ).start(0);
    return () => {
      seqRef.current?.dispose();
    };
  }, [synth]);

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
    <div className="audio-frequency-player-main-container">
      <button onClick={() => handleButtonClick()}>
        {audioPlayerState.isPlaying ? "Pause" : "Play"}
      </button>{" "}
    </div>
  );
};

export default AudioFequencyPlayer;
