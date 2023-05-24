import { CircularProgress } from "@mui/material";
import { FC } from "react";

interface LoadingAnimationProps {
  width?: string;
  height?: string;
}

const LoadingAnimation: FC<LoadingAnimationProps> = ({ width, height }) => {
  return (
    <div style={{ width: width && width, height: height && height }}>
      <CircularProgress sx={{ color: "white" }} />
    </div>
  );
};

export default LoadingAnimation;
