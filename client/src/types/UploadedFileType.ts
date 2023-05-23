export type UploadedFileState = {
  file: File | null;
  isLoadingUploading: boolean;
  isErrorUploading: boolean;
  errorMessageUploading: string | null;
  isSuccessUploading: boolean;
};

export const UploadedFileInitialState: UploadedFileState = {
  file: null,
  isLoadingUploading: false,
  isErrorUploading: false,
  errorMessageUploading: null,
  isSuccessUploading: false,
};
