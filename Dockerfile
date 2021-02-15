
FROM node:12-alpine

RUN apk update && \
    apk add git

WORKDIR /app

COPY ./package.json . 

RUN git submodule init && git submodule update

RUN npm install

COPY . .

CMD npm start

EXPOSE 3101
