export type AudioPlayerState = {
  isPlaying: boolean;
  isPaused: boolean;
  currentTime: number;
};

export const AudioPlayerInitialState: AudioPlayerState = {
  isPlaying: false,
  isPaused: false,
  currentTime: 0.0,
};
