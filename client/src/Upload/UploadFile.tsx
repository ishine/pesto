import { FC } from "react";
import { useDropzone } from "react-dropzone";
import "./UploadFile.css";
import LoadingAnimation from "../UI/LoadingAnimation";
import SimpleSVGComponent from "../UI/SimpleSVGComponent";
import addIcon from "../assets/add-icon.svg";

interface UploadFileProps {
  onUpload: (file: any) => void;
  isLoading: boolean;
  file: File | null;
}

const UploadFile: FC<UploadFileProps> = ({ onUpload, isLoading, file }) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "audio/mpeg": [".mp3"],
      "audio/x-wav": [".wav"],
      "audio/x-aiff": [".aif", ".aiff", ".aifc"],
    },
    onDrop: onUpload,
    maxFiles: 1,
    noKeyboard: true,
  });
  return (
    <div className="upload-file-main-container">
      <div {...getRootProps({ className: "upload-file-dropzone" })}>
        {isLoading ? (
          <LoadingAnimation width="15px" height="15px" />
        ) : file?.name ? (
          <>
            <SimpleSVGComponent width="29%" alt="add-icon" icon={addIcon} />
            <div>{file.name}</div>
          </>
        ) : (
          <>
            <SimpleSVGComponent width="29%" alt="add-icon" icon={addIcon} />
            <div>{"Upload file"}</div>
          </>
        )}
        <input {...getInputProps()} />
      </div>
    </div>
  );
};

export default UploadFile;
