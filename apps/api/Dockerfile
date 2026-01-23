# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=20.18.0
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="Node.js/Prisma"

# Node.js/Prisma app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# Install pnpm
RUN npm install -g pnpm


# Throw-away build stage to reduce size of final image
FROM base AS build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp openssl pkg-config python-is-python3

# Copy monorepo workspace files
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# Copy workspace packages
COPY packages ./packages
COPY config ./config

# Copy API application
COPY apps/api ./apps/api

# Install all dependencies (including workspace dependencies)
RUN pnpm install --frozen-lockfile --prod=false

# Generate Prisma Client
WORKDIR /app/apps/api
RUN pnpm prisma generate

# Build application
RUN pnpm run build


# Final stage for app image
FROM base

# Install packages needed for deployment
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y openssl && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Copy built application
COPY --from=build /app /app

# Set working directory to API app
WORKDIR /app/apps/api

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "sh", "-c", "pnpm prisma migrate deploy && pnpm run start" ]
