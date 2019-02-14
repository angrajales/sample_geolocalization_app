FROM node:11.8.0-slim

LABEL version="1.0"
LABEL description="Geolocalization App"
LABEL maintainer="Anderson Grajales - agrajal7@eafit.edu.co"

ARG PORT=3000
ENV PORT $PORT
ENV AWS=1


RUN mkdir geolocalization_app

WORKDIR /geolocalization_app
COPY . ./

RUN npm install

EXPOSE 3000
CMD npm run prod