FROM node:24-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.15.1 --activate
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm fetch --store-dir /pnpm/store

FROM base AS build
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY --from=deps /pnpm/store /pnpm/store
RUN pnpm install --offline --frozen-lockfile --store-dir /pnpm/store
COPY . .
ENV HUSKY=0
ENV NEXT_TELEMETRY_DISABLED=1
ARG NEXT_PUBLIC_SITE_URL=https://csti-challenge.orlando-rojas.com
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
RUN pnpm build

FROM node:24-alpine AS runner
RUN apk add --no-cache libc6-compat
WORKDIR /app
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs
COPY --from=build /app/public ./public
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=build --chown=nextjs:nodejs /app/node_modules/sharp ./node_modules/sharp
COPY --from=build --chown=nextjs:nodejs /app/node_modules/@img ./node_modules/@img
RUN mkdir -p .next/cache && chown -R nextjs:nodejs .next
USER nextjs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=25s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/health').then((response) => process.exit(response.ok ? 0 : 1)).catch(() => process.exit(1))"
CMD ["node", "server.js"]
