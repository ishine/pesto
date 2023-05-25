import { FC } from "react";
import "./RoundedTextInfo.css";

interface RoundedTextInfoProps {
  text: string;
}

const RoundedTextInfo: FC<RoundedTextInfoProps> = ({ text }) => {
  return <div className="rounded-text-info-main-container">{text}</div>;
};

export default RoundedTextInfo;
