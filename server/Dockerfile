FROM node:22-alpine

ENV NODE_ENV=production
WORKDIR /app

COPY package*.json ./
# Optional trust bundle for hosts with HTTPS inspection; never stored in the image.
RUN --mount=type=secret,id=ca_cert \
    if [ -f /run/secrets/ca_cert ]; then export NODE_EXTRA_CA_CERTS=/run/secrets/ca_cert; fi; \
    npm ci --omit=dev

COPY prisma.config.ts ./
COPY prisma ./prisma
RUN --mount=type=secret,id=ca_cert \
    if [ -f /run/secrets/ca_cert ]; then export NODE_EXTRA_CA_CERTS=/run/secrets/ca_cert; fi; \
    DATABASE_URL="postgresql://build:build@localhost:5432/build" npx --no-install prisma generate

COPY src ./src
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

ENV PORT=3000
EXPOSE 3000
USER node
ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "src/index.js"]
