import {
  FC,
  useEffect,
  useRef,
  useState,
} from "react";
import { AudioDataFromServerState } from "../types/AudioDataFromServer";
import "./FrequenceRoll.css";
import * as Tone from "tone";
import LoadingAnimation from "../UI/LoadingAnimation";
import RoundedTextInfo from "../UI/RoundedTextInfo";
import PianoRoll from "./Piano/PianoRoll";
import PianoTiles from "./Piano/PianoTiles";

interface FrequenceRollProps {
  audioData: AudioDataFromServerState;
}

const FrequenceRoll: FC<FrequenceRollProps> = ({
  audioData,
}) => {
  const [time, setTime] = useState<number>(0);

  useEffect(() => {
    Tone.Transport.scheduleRepeat(() => {
      setTime(Tone.Transport.seconds * 95);
    }, 0.01)
  }, []);

  const frequenceRollBorderMainContainer = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState<number>(0);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  useEffect(() => {
    if (frequenceRollBorderMainContainer.current != null && audioData.isSuccessFetching) {
      const divHeight = frequenceRollBorderMainContainer.current.offsetHeight;
      const divWidth = frequenceRollBorderMainContainer.current.offsetWidth;
      console.log("The height of the frequenceRollBorderMainContainer div in pixels is: " + divHeight + "px by " + divWidth + "px");
      setContainerHeight(divHeight);
      setContainerWidth(divWidth)
    } else {
      console.log("it's null");
    }
  }, [
      frequenceRollBorderMainContainer.current?.offsetHeight,
      frequenceRollBorderMainContainer.current?.offsetWidth,
      audioData.isSuccessFetching
  ]);

  return (
    <div ref={frequenceRollBorderMainContainer} className="frequence-roll-border-container">
      <div className="frequence-roll-main-container">
        {audioData.isLoadingFetching ? (
          <div className="frequence-roll-main-container-loading">
            <LoadingAnimation />
          </div>
        ) : audioData.data.length !== 0 ? (
          <div className="piano-roll-main-container">
              <PianoTiles audioData={audioData} confidence={0.8} height={containerHeight} width={containerWidth} />
              <PianoRoll audioData={audioData} confidence={0.8} height={containerHeight} width={containerWidth} time={time} />
          </div>
        ) : (
          <div className="frequence-roll-main-container-loading blinking-effect">
            <RoundedTextInfo text="Waiting for a file ..." />
          </div>
        )}
      </div>
    </div>
  );
};

export default FrequenceRoll;
