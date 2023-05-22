import os
from typing import List

from .predict import predict_from_files


def pesto(audio_files: List[str], output_folder: str):
    model_path = os.path.join(os.getcwd(), 'models/mir-1k.pth')
    step_size = 10.0

    predictions = predict_from_files(audio_files=audio_files, model_name=model_path, output=output_folder)
    return predictions
