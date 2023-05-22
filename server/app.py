import json
import os
import random
import shutil
import torch
import torchaudio
import io

from http import HTTPStatus

from flask import Flask, request, send_file, make_response, redirect, url_for  # Various imports for base Flask features
from flask_cors import CORS, cross_origin  # CORS
from flask_swagger_ui import get_swaggerui_blueprint  # Import for the swagger ui api document integration on the API
from flask_apscheduler import APScheduler

from werkzeug.utils import secure_filename

from api import api_endpoint, user_activity

# create and configure the api
app = Flask(__name__)

# Enable Cross-Origin Resource Sharing (CORS) for the server
app.config['CORS_EXPOSE_HEADERS'] = '*'
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['CORS_SUPPORTS_CREDENTIALS'] = True

# Enable Cross-Origin Resource Sharing (CORS) for the server
# In order to send resources through the API
CORS(app)

# Setup for the swagger api documentation on the server /docs/api
# It documents all the routes, their request bodies/parameters and expected responses
SWAGGER_URL = '/docs/api'
API_URL = '/static/openapi.json'
swaggerui_blueprint = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL
)
app.register_blueprint(swaggerui_blueprint)

app.register_blueprint(api_endpoint)


def clean_server_job():
    print("job is starting . ..")


class Config:
    JOBS = [
        {
            "id": "clean_server_job",
            "func": "app:clean_server_job",
            "args": (),
            "trigger": "interval",
            "minutes": 1,
        }
    ]
    SCHEDULER_API_ENABLED = True


app.config.from_object(Config())
scheduler = APScheduler()
scheduler.init_app(app)
scheduler.start()

if __name__ == '__main__':
    app.run(
        debug=True,
        host='0.0.0.0'
    )
