
FROM node:12-alpine

RUN apk update && \
    apk add git

WORKDIR /app

RUN git clone https://github.com/LiveChurchSolutions/ChumsApp.git .

RUN git submodule init && git submodule update

RUN npm install

CMD npm start

EXPOSE 3101
