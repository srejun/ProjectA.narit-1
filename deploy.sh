#!/bin/bash
git pull
git checkout deploy
git pull
sudo docker stop backend
sudo docker container rm backend
sudo docker build -t denice/nodejsapp .
sudo docker run -d -p 1111:8081 --name backend denice/nodejsapp
