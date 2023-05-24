import { FC } from "react";
import { AudioDataFromServerState } from "../types/AudioDataFromServer";
import "./FrequenceRoll.css";

interface FrequenceRollProps {
  audioData: AudioDataFromServerState;
}

const FrequenceRoll: FC<FrequenceRollProps> = ({ audioData }) => {
  return (
    <div className="frequence-roll-border-container">
      <div className="frequence-roll-main-container">FrequenceRoll</div>
    </div>
  );
};

export default FrequenceRoll;
