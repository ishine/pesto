import * as Tone from "tone";

export type SynthState = {
  synth: Tone.Synth | Tone.MonoSynth | Tone.FMSynth;
  attack: number;
};
