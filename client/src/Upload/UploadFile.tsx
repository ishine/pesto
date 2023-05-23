import { FC } from "react";
import { useDropzone } from "react-dropzone";
import './UploadFile.css'

interface UploadFileProps {
  onUpload: (file: any) => void;
}

const UploadFile: FC<UploadFileProps> = ({ onUpload }) => {
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
        Upload file
        <input {...getInputProps()} />
      </div>
    </div>
  );
};

export default UploadFile;
