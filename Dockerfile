FROM node:14-alpine AS build
WORKDIR /code
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:14-alpine AS deps
WORKDIR /code
COPY package.json package-lock.json ./
RUN npm ci --production
RUN npm i @mediaurl/redis-cache

FROM node:14-alpine
WORKDIR /code
COPY --from=build /code/dist ./dist/
COPY --from=deps /code/node_modules ./node_modules/
CMD node dist
