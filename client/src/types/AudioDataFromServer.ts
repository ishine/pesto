export type AudioDataFromServer = {
  frequencies: number[];
  confidence: number[];
  isErrorFetching: boolean;
  isLoadingFetching: boolean;
  isSuccessFetching: boolean;
  errorMessageFetching: string | null;
};

export const AudioDataFromServerInitialState: AudioDataFromServer = {
  frequencies: [],
  confidence: [],
  isErrorFetching: false,
  isLoadingFetching: false,
  isSuccessFetching: false,
  errorMessageFetching: null,
};
