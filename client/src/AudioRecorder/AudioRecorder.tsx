import { FC } from "react";
import {
  AudioRecorder as AudioRecorderComponent,
  useAudioRecorder,
} from "react-audio-voice-recorder";

interface AudioRecorderProps {
  onGetAudioRecorderElement: (blob: Blob) => void;
}

const AudioRecorder: FC<AudioRecorderProps> = ({
  onGetAudioRecorderElement,
}) => {
  const recorderControls = useAudioRecorder({
    noiseSuppression: true,
    echoCancellation: true,
  });
  return (
    <div className="audio-recorder-maoin-container">
      <AudioRecorderComponent
        onRecordingComplete={(blob) => onGetAudioRecorderElement(blob)}
        recorderControls={recorderControls}
        audioTrackConstraints={{
          noiseSuppression: true,
          echoCancellation: true,
        }}
      />
      <button onClick={recorderControls.startRecording}>Start Recording</button>
      <button onClick={recorderControls.stopRecording}>Stop Recording</button>
    </div>
  );
};

export default AudioRecorder;
