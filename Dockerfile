FROM node:20-alpine
WORKDIR /app
COPY . /app
EXPOSE 3003
CMD node index.mjs
