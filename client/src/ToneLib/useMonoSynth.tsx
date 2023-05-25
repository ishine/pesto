import * as Tone from "tone";
import { useRef } from "react";

type SynthOptions = ConstructorParameters<typeof Tone.MonoSynth>[0];

export const useMonoSynth = (options: SynthOptions): Tone.MonoSynth => {
  const Synth = useRef<Tone.MonoSynth>(new Tone.MonoSynth(options).toDestination());
  return Synth.current;
};

export default useMonoSynth;
