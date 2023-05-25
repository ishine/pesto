import { FC, useCallback, useEffect, useState } from "react";
import "./MainContainer.css";
import UploadFile from "../Upload/UploadFile";
import axios from "axios";
import {
  UploadedFileInitialState,
  UploadedFileState,
} from "../types/UploadedFileType";
import {
  AudioDataFromServerState,
  AudioDataFromServerInitialState,
} from "../types/AudioDataFromServer";
import AudioFrequencyPlayer from "../AudioPlayer/AudioFrequencyPlayer";
import FrequenceRoll from "../FrequenceRoll/FrequenceRoll";
import AudioRecorder from "../AudioRecorder/AudioRecorder";

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

const MainContainer: FC = () => {
  const [currentUploadedFileState, setCurrentUploadedFileState] =
    useState<UploadedFileState>(UploadedFileInitialState);
  const [audioDataFromServer, setAudioDataFromServer] =
    useState<AudioDataFromServerState>(AudioDataFromServerInitialState);

  useEffect(() => {
    axios
      .get(`${API_ENDPOINT}/cookies`)
      .then((res) => localStorage.setItem("user_id", res.headers["user-id"]))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (currentUploadedFileState.isSuccessUploading) {
      setAudioDataFromServer((data) => {
        return {
          ...data,
          isLoadingFetching: true,
          isSuccessFetching: false,
          data: [],
        };
      });
      axios
        .get(`${API_ENDPOINT}/audiofile/predict-pitch?step=10`, {
          headers: { "User-Id": localStorage.getItem("user_id") },
        })
        .then((res) => {
          setAudioDataFromServer((state) => {
            return {
              ...state,
              data: res.data,
              isSuccessFetching: true,
              isLoadingFetching: false,
            };
          });
        })
        .catch((err) => console.log(err));
    }
  }, [currentUploadedFileState.isSuccessUploading]);

  const onUpload = useCallback((file: File[]) => {
    uploadFileToServer(file[0]);
  }, []);

  const uploadFileToServer = (file: File) => {
    console.log(file);
    setCurrentUploadedFileState((state) => {
      return {
        ...state,
        isLoadingUploading: true,
        isSuccessUploading: false,
        file: file,
      };
    });
    const data = new FormData();
    data.append("file", file);
    axios
      .post(`${API_ENDPOINT}/audiofile/upload`, data, {
        headers: {
          "User-Id": localStorage.getItem("user_id"),
        },
      })
      .then((res) => {
        setCurrentUploadedFileState((state) => {
          return {
            ...state,
            isLoadingUploading: false,
            isSuccessUploading: true,
          };
        });
      })
      .catch((err) => console.log(err));
  };

  const onGetAudioRecorderElement = (blob: Blob) => {
    console.log(blob);
    const file = new File([blob], "audio-record.wav", { type: blob.type });
    uploadFileToServer(file);
  };

  return (
    <div className="main-container-main-container">
      <div className="left-side-main-container">
        <UploadFile
          isLoading={currentUploadedFileState.isLoadingUploading}
          onUpload={onUpload}
          file={currentUploadedFileState.file}
        />
        <AudioRecorder onGetAudioRecorderElement={onGetAudioRecorderElement} />
      </div>
      <div className="right-side-main-container">
        <AudioFrequencyPlayer audioData={audioDataFromServer} />
        <FrequenceRoll audioData={audioDataFromServer} />
      </div>
    </div>
  );
};

export default MainContainer;
