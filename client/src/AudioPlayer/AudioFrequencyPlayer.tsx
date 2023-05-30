import {Dispatch, FC, SetStateAction, useEffect, useRef, useState} from "react";
import {
  AudioDataFromServerInitialState,
  AudioDataFromServerState,
} from "../types/AudioDataFromServer";
import * as Tone from "tone";
import {
  AudioPlayerInitialState,
  AudioPlayerState,
} from "../types/AudioPlayerState";
import useSynth from "../ToneLib/useSynth";
import "./AudioFrequencyPlayer.css";
import LoadingAnimation from "../UI/LoadingAnimation";
import RoundedTextInfo from "../UI/RoundedTextInfo";
import useFMSynth from "../ToneLib/useFMSynth";
import useMonoSynth from "../ToneLib/useMonoSynth";
import BigRoundedButton from "../UI/BigRoundedButton";
import PianoIcon from "@mui/icons-material/Piano";
import SimpleSVGComponent from "../UI/SimpleSVGComponent";
import playIcon from "../assets/play-icon.svg";
import pauseIcon from "../assets/pause-icon.svg";
import { useAutoWah } from "../ToneLib/useAutoWah";
import GraphicEqIcon from "@mui/icons-material/GraphicEq";
import { SynthState } from "../types/SynthState";

interface AudioFrequencyPlayerProps {
  audioData: AudioDataFromServerState;

  audioPlayerState: AudioPlayerState;
  setAudioPlayerState:  Dispatch<SetStateAction<AudioPlayerState>>;
}

const AudioFrequencyPlayer: FC<AudioFrequencyPlayerProps> = ({ audioData, audioPlayerState, setAudioPlayerState }) => {
  // const [audioPlayerState, setAudioPlayerState] = useState<AudioPlayerState>(
  //   AudioPlayerInitialState
  // );
  const [synthAttack, setSynthAttack] = useState<number>();
  const Synth = useSynth({
    envelope: {
      attack: 0.5,
    },
  });
  const FMSynth = useFMSynth({
    envelope: {
      attack: 0,
    },
  });
  const MonoSynth = useMonoSynth({
    envelope: {
      attack: 0.5,
    },
    oscillator: {
      type: "square",
    },
  });
  const [currentInstrumentState, setCurrentInstrumentState] =
    useState<SynthState>({ synth: Synth, attack: 0 });
  const AutoWah = useAutoWah({ Q: 6 });
  const [isAutoWahSelected, setIsAutoWahSelected] = useState<boolean>(false);
  const seqRef = useRef<Tone.Sequence | null>(null);

  useEffect(() => {
    if (audioData.isSuccessFetching && audioData.data.length !== 0) {
      seqRef.current = new Tone.Sequence(
        (time, { frequency, confidence }) => {
          if (confidence > 0.7) {
            console.log(Tone.Transport.seconds);
            currentInstrumentState.synth.triggerAttackRelease(
              frequency,
              0.1,
              time
            );
          }
        },
        audioData.data,
        0.01
      ).start(0);
      console.log(seqRef.current);
    }
    return () => {
      seqRef.current?.dispose();
    };
  }, [
    audioData.isSuccessFetching,
    audioData.data,
    currentInstrumentState.synth,
  ]);

  useEffect(() => {
    if (audioData.isSuccessFetching && audioData.data.length !== 0) {
      console.log(audioData.data);
    }
  }, [audioData.isSuccessFetching, audioData.data]);

  // const onClickAutoWah = () => {
  //   if (isAutoWahSelected) {
  //     currentInstrument.disconnect();
  //     currentInstrument.toDestination();
  //     setIsAutoWahSelected(false);
  //   } else {
  //     currentInstrument.connect(AutoWah);
  //     setIsAutoWahSelected(true);
  //   }
  // };

  const handleButtonClick = async () => {
    if (Tone.Transport.state === "started") {
      Tone.Transport.stop();
      setAudioPlayerState((state) => {
        return {...state, isPlaying: false};
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
        ) : audioData.data.length === 0 ? (
          <RoundedTextInfo text="Waiting for a file ..." />
        ) : (
          <div className="audio-frequency-player-controls-container">
            {audioPlayerState.isPlaying ? (
              <SimpleSVGComponent
                icon={pauseIcon}
                alt="pause-icon"
                cursor={true}
                onClick={() => handleButtonClick()}
                width="3rem"
                height="3rem"
              />
            ) : (
              <SimpleSVGComponent
                icon={playIcon}
                alt="play-icon"
                cursor={true}
                onClick={() => handleButtonClick()}
                width="3rem"
                height="3rem"
              />
            )}
            <BigRoundedButton
              onClick={() =>
                setCurrentInstrumentState((state) => {
                  return { ...state, synth: Synth };
                })
              }
              icon={<PianoIcon />}
              isLoading={false}
              isSvg={false}
              text="Synth"
              margin="0px"
              backgroundColor={
                currentInstrumentState.synth !== Synth ? "#3F4043" : "#3B3650"
              }
            />
            <BigRoundedButton
              onClick={() =>
                setCurrentInstrumentState((state) => {
                  return { ...state, synth: FMSynth };
                })
              }
              icon={<PianoIcon />}
              isLoading={false}
              isSvg={false}
              text="FM Synth"
              margin="0px"
              backgroundColor={
                currentInstrumentState.synth !== FMSynth ? "#3F4043" : "#3B3650"
              }
            />
            <BigRoundedButton
              onClick={() =>
                setCurrentInstrumentState((state) => {
                  return { ...state, synth: MonoSynth };
                })
              }
              icon={<PianoIcon />}
              isLoading={false}
              isSvg={false}
              text="Mono Synth"
              margin="0px"
              backgroundColor={
                currentInstrumentState.synth !== MonoSynth
                  ? "#3F4043"
                  : "#3B3650"
              }
            />
            {/* <BigRoundedButton
              onClick={() => onClickAutoWah()}
              icon={<GraphicEqIcon />}
              isLoading={false}
              isSvg={false}
              text="Auto Wah"
              margin="0px"
              backgroundColor={!isAutoWahSelected ? "#3F4043" : "#3B3650"}
            /> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioFrequencyPlayer;
