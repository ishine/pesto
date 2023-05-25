import { FC } from "react";

interface SimpleSVGComponentProps {
  width?: string;
  icon: any;
  height?: string;
  cursor?: any;
  alt: string;
}

const SimpleSVGComponent: FC<SimpleSVGComponentProps> = ({
  width,
  icon,
  height,
  cursor,
  alt,
}) => {
  return (
    <>
      <img
        src={icon}
        style={{
          width: width ? width : "100%",
          height: height ? height : "100%",
          cursor: cursor ? "pointer" : "inherit",
        }}
        alt={alt}
      />
    </>
  );
};

export default SimpleSVGComponent;
