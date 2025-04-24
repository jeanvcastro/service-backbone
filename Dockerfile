# The first stage installs pnpm and prepares the environment.
FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# The second stage builds the application and runs migrations.
FROM base AS builder
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

# The third stage is for running database migrations.
FROM builder AS migrations
CMD ["pnpm", "run", "db:migrate"]

# The fourth stage is for running the application in development mode.
FROM base AS prod_deps
COPY package.json pnpm-lock.yaml ./
# cache
RUN --mount=type=cache,target=/root/.pnpm-store \
    pnpm install --prod --frozen-lockfile --ignore-scripts

# The final stage is for running the application in production mode.
FROM node:22-slim AS production
ENV NODE_ENV=production
WORKDIR /app
COPY --from=prod_deps /app/node_modules ./node_modules
COPY --from=builder   /app/dist         ./dist
COPY package.json .
EXPOSE 3000
CMD ["node", "dist/web/app.js"]
