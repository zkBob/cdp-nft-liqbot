FROM node:18.16.0-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn

COPY .graphclientrc.yml ./
COPY scripts ./scripts/

RUN yarn build-graph

ENTRYPOINT ["yarn", "run-bot"]
