import collections
import json
import operator
import os
import random
import shutil

from datetime import datetime

from flask import Flask, Blueprint, request, make_response, g, send_file
from flask_cors import CORS, cross_origin  # CORS

from http import HTTPStatus

from werkzeug.utils import secure_filename

# from route.toolbox import tools

from pesto.pesto import pesto
# pesto(audio_files=['../../../pesto/examples/example.wav'], model_path='models/mir-1k.pth', output_folder='test_results')

# Define the controller of the api endpoint
api_endpoint = Blueprint('api_endpoint', __name__, url_prefix='/')


@api_endpoint.route('/health', methods=["GET"])
@cross_origin
def get_ping():
    return Flask.response_class(response="Server is running", status=HTTPStatus.OK)
