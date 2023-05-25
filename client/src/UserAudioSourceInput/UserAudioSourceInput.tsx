import { FC } from "react";
import UploadFile from "../Upload/UploadFile";
import AudioRecorder from "../AudioRecorder/AudioRecorder";
import "./UserAudioSourceInput.css";
import CustomAudioPlayer from "../AudioPlayer/CustomAudioPlayer";

interface UserAudioSourceInputProps {
  isLoadingUploadedFile: boolean;
  onUploadFile: (file: any) => void;
  currentUploadedFile: File | null;
  onGetAudioRecorderElement: (blob: Blob) => void;
  isSuccessUploadingFile: boolean
}

const UserAudioSourceInput: FC<UserAudioSourceInputProps> = ({
  isLoadingUploadedFile,
  onGetAudioRecorderElement,
  onUploadFile,
  currentUploadedFile,
  isSuccessUploadingFile
}) => {
  return (
    <div className="user-audio-source-input-main-container">
      <div className="upload-and-record-border-container">
        <div className="upload-and-record-main-container">
          <UploadFile
            isLoading={isLoadingUploadedFile}
            onUpload={onUploadFile}
            file={currentUploadedFile}
          />
          <AudioRecorder
            onGetAudioRecorderElement={onGetAudioRecorderElement}
          />
        </div>
      </div>
      <div className="custom-audio-player-border-container">
        <div className="custom-audio-player-main-container">
          <CustomAudioPlayer file={currentUploadedFile} isSuccessUploadingFile={isSuccessUploadingFile} />
        </div>
      </div>
    </div>
  );
};

export default UserAudioSourceInput;
