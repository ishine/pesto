import * as Tone from "tone";
import { useRef } from "react";

type SynthOptions = ConstructorParameters<typeof Tone.FMSynth>[0];

export const useFMSynth = (options: SynthOptions): Tone.FMSynth => {
  const Synth = useRef<Tone.FMSynth>(new Tone.FMSynth(options).toDestination());
  return Synth.current;
};

export default useFMSynth;
