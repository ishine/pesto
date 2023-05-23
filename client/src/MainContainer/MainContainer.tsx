import { FC, useCallback, useEffect, useState } from "react";
import "./MainContainer.css";
import UploadFile from "../Upload/UploadFile";
import axios from "axios";
import {
  UploadedFileInitialState,
  UploadedFileState,
} from "../types/UploadedFileType";
import {
  AudioDataFromServer,
  AudioDataFromServerInitialState,
} from "../types/AudioDataFromServer";
import AudioFequencyPlayer from "../AudioPlayer/AudioFequencyPlayer";

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

const MainContainer: FC = () => {
  const [currentUploadedFileState, setCurrentUploadedFileState] =
    useState<UploadedFileState>(UploadedFileInitialState);
  const [audioDataFromServer, setAudioDataFromServer] =
    useState<AudioDataFromServer>(AudioDataFromServerInitialState);

  useEffect(() => {
    if (currentUploadedFileState.isLoadingUploading) {
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
  }, [currentUploadedFileState.isLoadingUploading]);

  const onUpload = useCallback((file: File[]) => {
    setCurrentUploadedFileState((state) => {
      return {
        ...state,
        isLoadingUploading: true,
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
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="main-container-main-container">
      <div className="left-side-main-container">
        {currentUploadedFileState.file && currentUploadedFileState.file.name}
        <UploadFile onUpload={onUpload} />
      </div>
      <div className="right-side-main-container">
        <AudioFequencyPlayer audioData={audioDataFromServer} />
      </div>
    </div>
  );
};

export default MainContainer;
