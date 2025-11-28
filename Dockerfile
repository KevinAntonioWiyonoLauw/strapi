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

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

FROM node:22-slim AS runtime

WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json

RUN npm install --omit=dev

EXPOSE 1337

CMD ["npm", "start"]
