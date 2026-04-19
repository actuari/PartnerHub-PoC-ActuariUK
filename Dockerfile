FROM node:20-alpine3.16 AS builder
RUN apk add --no-cache libc6-compat openssl-dev
WORKDIR /app
COPY . .
RUN npm ci
RUN npx prisma generate
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build --production

FROM node:20-alpine3.16 AS runner
RUN apk add --no-cache openssl
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app ./

USER nextjs

EXPOSE 8080
CMD ["npm", "run", "start"]