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
import UserAudioSourceInput from "../UserAudioSourceInput/UserAudioSourceInput";
import AudioResults from "../AudioResults/AudioResults";

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

const MainContainer: FC = () => {
  const [currentUploadedFileState, setCurrentUploadedFileState] =
    useState<UploadedFileState>(UploadedFileInitialState);
  const [audioDataFromServer, setAudioDataFromServer] =
    useState<AudioDataFromServerState>(AudioDataFromServerInitialState);

  const id = localStorage.getItem('user_id');
  const headers = id ? { 'User-Id': id } : {};

  useEffect(() => {
    axios
      .get(`${API_ENDPOINT}/cookies`, {
        headers: headers
      })
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
      <UserAudioSourceInput
        onGetAudioRecorderElement={onGetAudioRecorderElement}
        onUploadFile={onUpload}
        currentUploadedFile={currentUploadedFileState.file}
        isLoadingUploadedFile={currentUploadedFileState.isLoadingUploading}
        isSuccessUploadingFile={currentUploadedFileState.isSuccessUploading}
      />
      <AudioResults audioData={audioDataFromServer} />
    </div>
  );
};

export default MainContainer;
