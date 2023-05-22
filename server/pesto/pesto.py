from typing import List

from .predict import predict_from_files


# Namespace(
#   audio_files=['../../../pesto/examples/example.wav']
#   model_name='mir-1k'
#   output=None
#   export_format=['csv']
#   reduction='alwa'
#   step_size=10.0
#   no_convert_to_freq=False
#   gpu=-1
# )

def pesto(audio_files: List[str], model_path: str, output_folder: str):
    predictions = predict_from_files(audio_files=audio_files, model_name=model_path, output=output_folder)
    return predictions
