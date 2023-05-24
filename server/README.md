docker build -t pesto-server .
docker run -dp 5010:5010 -v server/models:/server pesto_server