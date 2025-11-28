FROM node:18-alpine

RUN apk update && apk add --no-cache \
  build-base \
  gcc \
  autoconf \
  automake \
  zlib-dev \
  libpng-dev \
  nasm \
  bash \
  vips-dev \
  git

RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /opt/app

COPY package.json pnpm-lock.yaml ./

RUN pnpm config set fetch-retry-maxtimeout 600000

RUN pnpm install --frozen-lockfile

COPY . .

RUN chown -R node:node /opt/app
USER node

# Build Strapi
RUN pnpm run build

EXPOSE 1337

CMD ["pnpm", "run", "start"]

