import os

import torch

from .config import model_args, cqt_args, bins_per_semitone
from .data import DataProcessor
from .model import PESTOEncoder


def load_dataprocessor(device: torch.device | None = None):
    return DataProcessor(**cqt_args).to(device)


def load_model(model_name: str, device: torch.device | None = None) -> PESTOEncoder:
    model = PESTOEncoder(**model_args).to(device)
    model.eval()

    model_path = os.path.join(model_name)
    model.load_state_dict(torch.load(model_path, map_location=device))

    return model


def reduce_activation(activations: torch.Tensor, reduction: str):
    r"""

    Args:
        activations: tensor of probability activations, shape (num_frames, num_bins)
        reduction:

    Returns:

    """
    bps = bins_per_semitone
    if reduction == "argmax":
        pred = activations.argmax(dim=1)
        return pred.float() / bps

    all_pitches = (torch.arange(activations.size(1), dtype=torch.float)) / bps
    if reduction == "mean":
        return torch.mm(activations, all_pitches)

    if reduction == "alwa":  # argmax-local weighted averaging, see https://github.dev/marl/crepe
        center_bin = activations.argmax(dim=1, keepdim=True)
        window = torch.arange(-bps+1, bps)
        indices = window + center_bin
        cropped_activations = activations.gather(1, indices)
        cropped_pitches = all_pitches.unsqueeze(0).expand_as(activations).gather(1, indices)
        return (cropped_activations * cropped_pitches).sum(dim=1) / cropped_activations.sum(dim=1)

    raise ValueError
