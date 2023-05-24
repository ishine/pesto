import collections
import json
import operator
import os
import random
import shutil
import torch

from datetime import datetime

from flask import Flask, Blueprint, request, make_response, g, send_file
from flask_cors import CORS, cross_origin  # CORS

from http import HTTPStatus

from werkzeug.utils import secure_filename

from route.tools.parameters.extract_request_argument import extract_request_argument

from pesto.pesto import pesto

# Define the controller of the api endpoint
api_endpoint = Blueprint('api_endpoint', __name__, url_prefix='/')

user_activity = {}


def before_each_api_request():
    if not request.method == 'OPTIONS':
        if not request.cookies.get("User-Id"):
            print("creating a new user ..")
            user_id = "".join(random.choice("abcdefghijklmnopqrstuvwxyz0123456789") for i in range(16))

            folder_path = os.path.join(os.getcwd(), "data", user_id)

            os.makedirs(folder_path)
        else:
            user_id = request.cookies.get("User-Id")

            folder_path = os.path.join(os.getcwd(), "data", user_id)

            if not os.path.exists(folder_path):
                os.makedirs(folder_path)

        print("user:", user_id, folder_path)
        g.user_id = user_id
        g.user_folder_path = folder_path


def after_each_api_request():
    user_id = g.get('user_id', None)
    user_activity[user_id] = datetime.now().isoformat()


@api_endpoint.before_request
def api_before_request_decorator():
    before_each_api_request()


@api_endpoint.after_request
def api_after_request_decorator(response):
    after_each_api_request()

    return response


class CustomJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, torch.Tensor):
            if obj.dim() == 0:
                return obj.item()
            return obj.tolist()  # Convert Tensor to nested list representation
        return super().default(obj)


# Flask route /upload using a POST Request
@api_endpoint.route('/audiofile/upload', methods=['POST'])
@cross_origin()
def post_audiofile_upload():
    response = make_response('Audiofile uploaded')

    user_id = g.get('user_id', None)
    user_folder_path = g.get('user_folder_path', None)

    # step = extract_request_argument(request, 'step')

    # Check if file was passed as request parameter, if not send response with http code 400
    if 'file' not in request.files:
        return Flask.response_class(
            response='No file sent',
            status=400,
            mimetype='application/json'
        )

    # Assign the file passed as parameter to local variable
    file = request.files['file']

    # Check the file size, and limits it to 70mb (average wav file is 10mb per minute)
    file_size = file.seek(0, os.SEEK_END)
    file.seek(0, os.SEEK_SET)

    # Check if the file passed as parameter is has a valid value (not empty)
    # If not, send response to client, request triggered and error
    if file.filename == '':
        return Flask.response_class(
            response='No file selected',
            status=HTTPStatus.BAD_REQUEST,
            mimetype='application/json'
        )

    # Assign the file filename to local variable using secure_filename (from Werkzeug) which returns a secure version
    # of it so that it can be safely stored
    filename = secure_filename(file.filename)
    file_path = os.path.join(user_folder_path, filename)

    file.save(file_path)

    response.set_cookie('User-Id', value=user_id, domain=request.remote_addr)

    return response, HTTPStatus.OK


# Flask route /predict-pitch using a POST Request
@api_endpoint.route('/predict-pitch', methods=['POST'])
@cross_origin()
def post_sample_from_environment():
    response = make_response('Latent space')

    user_id = g.get('user_id', None)
    user_folder_path = g.get('user_folder_path', None)
    response.set_cookie('User-Id', value=user_id, domain=request.remote_addr)

    step = extract_request_argument(request, 'step')

    # Check if file was passed as request parameter, if not send response with http code 400
    if 'file' not in request.files:
        return Flask.response_class(response='No file(s) sent', status=400, mimetype='application/json')

    # Assign the file passed as parameter to local variable
    file = request.files['file']

    # Check the file size, and limits it to 70mb (average wav file is 10mb per minute)
    file_size = file.seek(0, os.SEEK_END)
    file.seek(0, os.SEEK_SET)

    # Check if the file passed as parameter is has a valid value (not empty)
    # If not, send response to client, request triggered and error
    if file.filename == '':
        return Flask.response_class(response='No file(s) selected', status=400, mimetype='application/json')

    # Assign the file filename to local variable using secure_filename (from Werkzeug) which returns a secure version
    # of it so that it can be safely stored
    filename = secure_filename(file.filename)
    file_path = os.path.join(user_folder_path, filename)

    file.save(file_path)

    if step is not None:
        predictions = pesto(audio_files=[file_path], output_folder=user_folder_path, step=float(step))
    else:
        predictions = pesto(audio_files=[file_path], output_folder=user_folder_path)

    predictions_pitch = predictions[1].tolist()
    predictions_confidence = predictions[2].tolist()

    data = []
    for pitch, confidence in zip(predictions_pitch, predictions_confidence):
        data.append({
            'frequency': pitch,
            'confidence': confidence
        })

    response.set_data(json.dumps(data))

    return response, HTTPStatus.OK


@api_endpoint.route('/health', methods=["GET"])
@cross_origin()
def get_ping():
    return Flask.response_class(response="Server is running", status=HTTPStatus.OK)
