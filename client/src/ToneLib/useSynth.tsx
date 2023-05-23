import * as Tone from "tone";
import { useRef } from "react";

type SynthOptions = ConstructorParameters<typeof Tone.Synth>[0];

export const useSynth = (options: SynthOptions): Tone.Synth => {
  const Synth = useRef<Tone.Synth>(new Tone.Synth(options).toDestination());
  return Synth.current;
};

export default useSynth;
