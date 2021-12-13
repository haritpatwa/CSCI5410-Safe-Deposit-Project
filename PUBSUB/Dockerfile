FROM node:14


WORKDIR /app

COPY . /app

COPY ["package.json", "package-lock.json*", "./"]


RUN npm install


EXPOSE 9000

CMD [ "node", "index.js" ]