FROM node:22-slim AS build

# deps OS (untuk sharp dll)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential python3 git curl libvips-dev && \
    rm -rf /var/lib/apt/lists/*

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g pnpm

WORKDIR /app

# install deps pakai pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# copy source code
COPY . .

# build strapi
RUN pnpm run build

FROM node:22-slim AS runtime

WORKDIR /app

# copy hasil build & deps
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json

ENV NODE_ENV=production
EXPOSE 1337

CMD ["npm", "start"]
