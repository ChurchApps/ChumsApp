
FROM node:12-alpine

RUN apk update && \
    apk add git

WORKDIR /app

COPY ./package.json . 

RUN npm install

COPY . .

RUN git submodule init && git submodule update

CMD npm start

EXPOSE 3101
