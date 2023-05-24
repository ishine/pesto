import { FC } from "react";
import { useDropzone } from "react-dropzone";
import "./UploadFile.css";
import LoadingAnimation from "../LoadingAnimation/LoadingAnimation";

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
    <div className="upload-file-border-container">
      <div className="upload-file-main-container">
        <div {...getRootProps({ className: "upload-file-dropzone" })}>
          {isLoading ? (
            <LoadingAnimation />
          ) : file?.name ? (
            file?.name
          ) : (
            "Upload a file"
          )}
          <input {...getInputProps()} />
        </div>
      </div>
    </div>
  );
};

export default UploadFile;
