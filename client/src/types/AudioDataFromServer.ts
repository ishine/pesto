export type AudioData = {
  frequency: number;
  tone: number;
  confidence: number;
};

export type AudioDataFromServerState = {
  data: AudioData[];
  isErrorFetching: boolean;
  isLoadingFetching: boolean;
  isSuccessFetching: boolean;
  errorMessageFetching: string | null;
  step: number;
};

export const AudioDataFromServerInitialState: AudioDataFromServerState = {
  data: [],
  isErrorFetching: false,
  isLoadingFetching: false,
  isSuccessFetching: false,
  errorMessageFetching: null,
  step: 0.01
};
