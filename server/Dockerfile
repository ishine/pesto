FROM python:3.10

# Update
RUN apt-get update
RUN pip install --upgrade pip

# Install soundfile dependency
RUN apt-get install -y libsndfile1 ffmpeg sox libsox-fmt-mp3

# Install requirements
COPY requirements.txt /tmp/requirements.txt
WORKDIR /tmp
RUN pip3 install -r requirements.txt

# Copy api
COPY . /server

WORKDIR /server

# Build the api
EXPOSE 5010
CMD [ "gunicorn", "-w", "3", "-b", ":5010", "-t", "360", "--reload", "wsgi:app" ]
