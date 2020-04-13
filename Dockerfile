FROM node:13
LABEL version="1.0"
WORKDIR /code
COPY package.json ./
RUN npm i
COPY . .
RUN npm run build
CMD npm run start
