from .predict import predict_from_file


def pesto(model, data_preprocessor,
          audiofile: str, step: float = 10.):
    predictions, data_preprocessor = predict_from_file(
        model=model,
        data_preprocessor=data_preprocessor,

        audio_file=audiofile,
        step_size=step
    )
    return predictions, data_preprocessor
