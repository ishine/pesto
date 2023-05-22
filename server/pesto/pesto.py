import os
from typing import List

from .predict import predict_from_files


def pesto(audio_files: List[str], output_folder: str, step: float = 0.10):
    model_path = os.path.join(os.getcwd(), 'models/mir-1k.pth')

    predictions = predict_from_files(
        audio_files=audio_files,
        model_name=model_path,
        output=output_folder,
        step_size=step
    )
    return predictions
