FROM node:20.11.1-alpine AS base

FROM base AS deps
WORKDIR /app

COPY package.json package-lock.json ./

COPY prisma ./prisma

ENV NPM_CONFIG_CACHE=/app/.npm NPM_CONFIG_PREFER_OFFLINE=true NPM_CONFIG_AUDIT=false NPM_CONFIG_FUND=false 

RUN npm install --prefer-offline --no-audit --no-fund --loglevel=error

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npx prisma generate --schema=./prisma/schema.prisma

ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 2000 appgroup && \
    adduser --system --uid 1001 --ingroup appgroup nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma/schema.prisma ./prisma/schema.prisma

USER nextjs

EXPOSE 3000

LABEL author="Artithm" author_email="admin@artithm.com" author_url="https://artithm.com" author_github="https://github.com/emirage-niallchen"

ENV PORT=3000 HOSTNAME=0.0.0.0

# 设置命令以启动应用
CMD ["node", "server.js"] 