import { FC, useCallback, useEffect, useRef, useState } from "react";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { motion, AnimatePresence } from "framer-motion";
import SimpleSVGComponent from "../UI/SimpleSVGComponent";
import "./CustomAudioPlayer.css";

import playIcon from "../assets/play-icon.svg";
import pauseIcon from "../assets/pause-icon.svg";

import backwardIcon from "../assets/backward-icon.svg";
import forwardIcon from "../assets/forward-icon.svg";

interface CustomAudioPlayerProps {
  file: File | null;
  isSuccessUploadingFile: boolean
}

const CustomAudioPlayer: FC<CustomAudioPlayerProps> = ({ file, isSuccessUploadingFile }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [url, setUrl] = useState<string>("");

  const audioPlayer = useRef<any>();
  const timeProgressBar = useRef<any>();
  const animation = useRef<any>();
  const volumeBar = useRef<any>();

  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(30);

  useEffect(() => {
    if (file) {
      const tmpUrl = URL.createObjectURL(file);
      setDuration(0);
      setCurrentTime(0);
      setIsPlaying(false);
      timeProgressBar.current.value = 0;
      setUrl(tmpUrl);
      const seconds = Math.floor(audioPlayer?.current?.duration);
    }
  }, [isSuccessUploadingFile]);

  useEffect(() => {
    const seconds = Math.floor(audioPlayer?.current?.duration);
    setDuration(seconds);
    timeProgressBar.current.max = seconds;
  }, [audioPlayer?.current?.loadedmetadata, audioPlayer?.current?.readyState]);

  /* To perform autoloop */
  useEffect(() => {
    if (currentTime == duration && currentTime !== 0) {
      audioPlayer.current.currentTime = 0;
      timeProgressBar.current.value = 0;
      timeProgressBar.current.style.setProperty(
        "--seek-before-width",
        `${(timeProgressBar.current.value / duration) * 100}%`
      );
      setCurrentTime(timeProgressBar.current.value);
    }
  }, [currentTime, duration]);

  const computeTime = useCallback(
    (secs: number) => {
      const minutes = Math.floor(secs / 60);
      const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
      const seconds = Math.floor(secs % 60);
      const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
      return `${returnedMinutes}:${returnedSeconds}`;
    },
    [duration, currentTime]
  );

  const togglePlayPause = () => {
    if (!url) return;
    const value = isPlaying;
    setIsPlaying(!value);
    if (!value) {
      audioPlayer.current.play();
      audioPlayer.current.volume = volume / 100;
      animation.current = requestAnimationFrame(whileAudioIsPlaying);
    } else {
      audioPlayer.current.pause();
      cancelAnimationFrame(animation.current);
    }
  };

  const changeTimePosition = () => {
    audioPlayer.current.currentTime = timeProgressBar.current.value;
    timeProgressBar.current.style.setProperty(
      "--seek-before-width",
      `${(timeProgressBar.current.value / duration) * 100}%`
    );
    setCurrentTime(timeProgressBar.current.value);
  };

  const whileAudioIsPlaying = () => {
    timeProgressBar.current.value = audioPlayer.current.currentTime;
    timeProgressBar.current.style.setProperty(
      "--seek-before-width",
      `${(timeProgressBar.current.value / duration) * 100}%`
    );
    setCurrentTime(timeProgressBar.current.value);
    animation.current = requestAnimationFrame(whileAudioIsPlaying);
  };

  const backwardAudio = () => {
    timeProgressBar.current.value -= 3;
    timeProgressBar.current.style.setProperty(
      "--seek-before-width",
      `${(timeProgressBar.current.value / duration) * 100}%`
    );
    audioPlayer.current.currentTime = timeProgressBar.current.value;
    setCurrentTime(timeProgressBar.current.value);
  };

  const forwardAudio = () => {
    timeProgressBar.current.value += 3;
    timeProgressBar.current.style.setProperty(
      "--seek-before-width",
      `${(timeProgressBar.current.value / duration) * 100}%`
    );
    audioPlayer.current.currentTime = timeProgressBar.current.value;
    setCurrentTime(timeProgressBar.current.value);
  };

  const changeVolume = () => {
    audioPlayer.current.volume = volumeBar.current.value / 100;
    setVolume(volumeBar.current.value);
  };

  return (
    <div className="main-audio-player-container">
      <audio src={url} ref={audioPlayer} />

      <div
        style={{
          width: "16%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          className="rounded-button-container"
          style={{ position: "relative" }}
        >
          <VolumeUpIcon
            onMouseEnter={() => setIsHovering(true)}
            style={{ background: "#3F4043" }}
          />
          <AnimatePresence>
            {isHovering && (
              <motion.div
                animate={{ opacity: 1 }}
                initial={{ opacity: 0 }}
                exit={{ opacity: 0 }}
                onMouseLeave={() => setIsHovering(false)}
                className="volume-input-drop-down-container"
              >
                <div>
                  <p>{volume}</p>
                  <input
                    type="range"
                    ref={volumeBar}
                    defaultValue={volume}
                    onChange={changeVolume}
                    className="audio-progress-bar"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="audio-player-container">
        <div className="audio-player-controls-container">
          <div className="audio-player-icon" onClick={backwardAudio}>
            <SimpleSVGComponent
              icon={backwardIcon}
              alt="backward-icon"
              cursor={true}
            />
          </div>
          <div className="audio-player-icon" onClick={togglePlayPause}>
            {isPlaying ? (
              <SimpleSVGComponent
                icon={pauseIcon}
                alt="pause-icon"
                cursor={true}
              />
            ) : (
              <SimpleSVGComponent
                icon={playIcon}
                alt="play-icon"
                cursor={true}
              />
            )}
          </div>
          <div className="audio-player-icon" onClick={forwardAudio}>
            <SimpleSVGComponent
              icon={forwardIcon}
              alt="forward-icon"
              cursor={true}
            />
          </div>
        </div>

        <div className="audio-player-time-container">
          <div className="audio-player-time-indicator-container">
            <div> {computeTime(currentTime)}</div>
          </div>
          <div className="audio-progress-bar-container">
            <input
              type="range"
              className="audio-progress-bar"
              ref={timeProgressBar}
              defaultValue="0"
              onChange={changeTimePosition}
            />
          </div>

          <div className="audio-player-time-indicator-container">
            {!isNaN(duration) && computeTime(duration)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomAudioPlayer;
