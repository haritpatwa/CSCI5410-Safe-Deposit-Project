FROM node:14


WORKDIR /app

COPY . /app

COPY ["package.json", "package-lock.json*", "./"]


RUN npm install


EXPOSE 3000

CMD [ "npm", "start" ]