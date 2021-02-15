
FROM node:12-alpine

RUN apk update && \
    apk add git

WORKDIR /app

COPY . .

RUN git submodule init && git submodule update

RUN npm install

CMD npm start

EXPOSE 3101
