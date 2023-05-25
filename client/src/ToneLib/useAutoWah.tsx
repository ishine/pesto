import * as Tone from "tone";
import { useRef } from "react";

type AutoWahOptions = ConstructorParameters<typeof Tone.AutoWah>[0];

export const useAutoWah = (options: AutoWahOptions): Tone.AutoWah => {
  const AutoWah = useRef<Tone.AutoWah>(new Tone.AutoWah(options).toDestination());
  return AutoWah.current;
};

export default AutoWahOptions;
