import { CircularProgress } from "@mui/material";
import { FC } from "react";
import "./BigRoundedButton.css";

interface BigRoundedButtonProps {
  isLoading: boolean;
  onClick: any;
  width?: string;
  height?: string;
  backgroundColor?: string;
  fontSize?: string;
  fontWeight?: string;
  margin?: string;
  padding?: string;
  icon: any;
  isSvg: boolean;
  text: string;
}

const BigRoundedButton: FC<BigRoundedButtonProps> = ({
  isLoading,
  onClick,
  width,
  height,
  backgroundColor,
  fontSize,
  fontWeight,
  margin,
  padding,
  icon,
  isSvg,
  text,
}) => {
  return (
    <div
      onClick={isLoading ? () => null : () => onClick()}
      className="big-rounded-button-main-container"
      style={{
        width: width ? width : "9rem",
        height: height ? height : "auto",
        backgroundColor: backgroundColor && backgroundColor,
        fontSize: fontSize ? fontSize : "inherit",
        fontWeight: fontWeight ? fontWeight : "inherit",
        margin: margin && margin,
        padding: padding && padding,
      }}
    >
      {isLoading ? (
        <>
          <CircularProgress
            style={{ color: "white", width: "2em", height: "2em" }}
          />
        </>
      ) : (
        <>
          {isSvg ? <img alt="button-icon" src={icon} /> : <>{icon}</>}
          <span
            className="big-rounded-button-text"
            style={{
              marginLeft: "0.5em",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {text}
          </span>
        </>
      )}
    </div>
  );
};

export default BigRoundedButton;
