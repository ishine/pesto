import { FC } from "react";
import {
  AudioRecorder as AudioRecorderComponent,
  useAudioRecorder,
} from "react-audio-voice-recorder";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  audioRecorderIcon: {
    backgroundColor: "#3F4043",
    boxShadow: "2px 2px 4px rgb(0 0 0 / 42%)",
    color: "white",
  },
  audioRecorderWhite: {
    color: "white",
  },
});

interface AudioRecorderProps {
  onGetAudioRecorderElement: (blob: Blob) => void;
}

const AudioRecorder: FC<AudioRecorderProps> = ({
  onGetAudioRecorderElement,
}) => {
  const styles = useStyles();
  const recorderControls = useAudioRecorder({
    noiseSuppression: true,
    echoCancellation: true,
  });
  return (
    <div className="audio-recorder-maoin-container">
      <AudioRecorderComponent
        classes={{
          AudioRecorderClass: styles.audioRecorderIcon,
          AudioRecorderStatusClass: styles.audioRecorderWhite,
          AudioRecorderDiscardClass: styles.audioRecorderWhite,
          AudioRecorderStartSaveClass: styles.audioRecorderWhite,
          AudioRecorderPauseResumeClass: styles.audioRecorderWhite,
          AudioRecorderTimerClass: styles.audioRecorderWhite,
        }}
        onRecordingComplete={(blob) => onGetAudioRecorderElement(blob)}
        recorderControls={recorderControls}
        audioTrackConstraints={{
          noiseSuppression: true,
          echoCancellation: true,
        }}
      />
    </div>
  );
};

export default AudioRecorder;
