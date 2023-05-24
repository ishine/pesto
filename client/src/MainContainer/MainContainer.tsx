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

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

const MainContainer: FC = () => {
  const [currentUploadedFileState, setCurrentUploadedFileState] =
    useState<UploadedFileState>(UploadedFileInitialState);
  const [audioDataFromServer, setAudioDataFromServer] =
    useState<AudioDataFromServerState>(AudioDataFromServerInitialState);

  useEffect(() => {
    if (currentUploadedFileState.isSuccessUploading) {
      console.log("Fetching data !");
      setAudioDataFromServer((data) => {
        return { ...data, isLoadingFetching: true };
      });
      axios
        .get(`${API_ENDPOINT}/health`)
        .then((res) => {
          setAudioDataFromServer((data) => {
            return {
              ...data,
              frequencies: res.data.frequencies,
              confidence: res.data.confidence,
              isSuccessFetching: true,
              isLoadingFetching: false,
            };
          });
        })
        .catch((err) => console.log(err));
    }
  }, [currentUploadedFileState.isSuccessUploading]);

  const onUpload = useCallback((file: File[]) => {
    setCurrentUploadedFileState((state) => {
      return {
        ...state,
        isLoadingUploading: true,
        isSuccessUploading: false,
        file: file[0],
      };
    });
    const data = new FormData();
    data.append("file", file[0]);
    axios
      .post(`${API_ENDPOINT}/predict-pitch`, data)
      .then((res) => {
        console.log(res);
        setCurrentUploadedFileState((state) => {
          return {
            ...state,
            isLoadingUploading: false,
            isSuccessUploading: true,
          };
        });
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
  }, []);

  return (
    <div className="main-container-main-container">
      <div className="left-side-main-container">
        <UploadFile isLoading={currentUploadedFileState.isLoadingUploading} onUpload={onUpload} file={currentUploadedFileState.file} />
      </div>
      <div className="right-side-main-container">
        <AudioFrequencyPlayer audioData={audioDataFromServer} />
        <FrequenceRoll audioData={audioDataFromServer} />
      </div>
    </div>
  );
};

export default MainContainer;
