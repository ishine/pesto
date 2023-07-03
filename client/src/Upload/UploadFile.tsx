import { FC } from "react";
import { useDropzone } from "react-dropzone";
import "./UploadFile.css";
import LoadingAnimation from "../UI/LoadingAnimation";
import SimpleSVGComponent from "../UI/SimpleSVGComponent";
import AddIcon from "../assets/add-icon.svg";

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
      <div {...getRootProps({ className: "upload-file-dropzone", style: {
          border: `1px ${(file?.name ? 'solid' : 'dashed')} #fff`
        } })}>
        {isLoading ? (
          <LoadingAnimation width="15px" height="15px" />
        ) : file?.name ? (
          <>
            <SimpleSVGComponent width="10%" alt="add-icon" icon={AddIcon} />
            <div>{file.name}</div>
          </>
        ) : (
          <>
            <SimpleSVGComponent width="10%" alt="add-icon" icon={AddIcon} />
            <div className="upload-file-dropzone-text">{"Upload file"}</div>
          </>
        )}
        <input {...getInputProps()} />
      </div>
    </div>
  );
};

export default UploadFile;
