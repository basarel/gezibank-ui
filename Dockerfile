# Stage 1: Base image with dependencies
FROM node:20-alpine AS base
WORKDIR /app

# Disable telemetry and enable corepack for pnpm
ENV NEXT_TELEMETRY_DISABLED=1
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Install system dependencies
RUN apk add --no-cache libc6-compat && \
     corepack enable && \
     corepack prepare pnpm@10.13.1 --activate

# Stage 2: Install dependencies
FROM base AS deps
# Copy package files
COPY package.json pnpm-lock.yaml ./
# Install dependencies with frozen lockfile for reproducible builds
# Ignore scripts during install since prepare hook needs source code
RUN pnpm install --frozen-lockfile --prod=false --ignore-scripts

# Stage 3: Build application
FROM base AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
# Copy source code
COPY . .

# Build arguments (can be overridden at build time)
ARG NEXT_PUBLIC_SERVER_URL
ARG DATABASE_URI
ARG PAYLOAD_SECRET
ARG S3_BUCKET
ARG S3_ACCESS_KEY_ID
ARG S3_SECRET_ACCESS_KEY
ARG S3_REGION
ARG S3_ENDPOINT
ARG S3_CDN_URL
ARG S3_PREFIX

# Set build-time environment variables
ENV NEXT_PUBLIC_SERVER_URL=${NEXT_PUBLIC_SERVER_URL}
ENV DATABASE_URI=${DATABASE_URI}
ENV PAYLOAD_SECRET=${PAYLOAD_SECRET}
ENV S3_BUCKET=${S3_BUCKET}
ENV S3_ACCESS_KEY_ID=${S3_ACCESS_KEY_ID}
ENV S3_SECRET_ACCESS_KEY=${S3_SECRET_ACCESS_KEY}
ENV S3_REGION=${S3_REGION}
ENV S3_ENDPOINT=${S3_ENDPOINT}
ENV S3_CDN_URL=${S3_CDN_URL}
ENV S3_PREFIX=${S3_PREFIX}
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# Increase Node.js heap size for build (prevents "JavaScript heap out of memory" errors)
ENV NODE_OPTIONS=--max-old-space-size=4096

# Run prepare script (generates theme.css) now that source code is available
RUN pnpm run prepare

# Build the application
RUN pnpm build

# Stage 4: Production runner
FROM node:20-alpine AS runner
WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=9193 

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
     adduser --system --uid 1001 nextjs

# Install runtime dependencies
RUN apk add --no-cache libc6-compat curl

# Copy standalone build from builder
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Switch to non-root user
USER nextjs

# Expose port (ECS will map this)
EXPOSE 9193 

# Health check for ECS
# IMPORTANT: This runs INSIDE the container, so localhost refers to the container's own network
# This is correct - we're checking if the app inside the container is responding
# ECS will use this to determine container health status
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
     CMD sh -c 'curl -f http://localhost:${PORT:-9193}/ || exit 1'

# Start the application
CMD ["node", "server.js"]
