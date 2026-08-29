FROM node:25.2.1-alpine3.21@sha256:32509199057d74a987fdd88cde00fdfd48ef52469adbd6bd11969fc701477761 AS builder
WORKDIR /app
COPY /src ./src
COPY package.json package-lock.json .npmrc ./

RUN npm ci
RUN npm run build

# npm ci --omit=dev after a full install doesn't properly prune dev dependencies.
# so delete node_modules and reinstall only production packages.
RUN [ "rm", "-rf", "node_modules" ]
RUN npm ci --omit=dev

FROM node:25.2.1-alpine3.21@sha256:32509199057d74a987fdd88cde00fdfd48ef52469adbd6bd11969fc701477761 AS final
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

RUN ["apk", "--no-cache", "upgrade"]
RUN ["apk", "add", "--no-cache", "tini", "curl"]
USER appuser:appgroup

WORKDIR /app
# Copy in compile assets and deps from build container
COPY --chown=appuser:appgroup  --from=builder /app/node_modules ./node_modules
COPY --chown=appuser:appgroup  --from=builder /app/dist ./dist
COPY --chown=appuser:appgroup  --from=builder /app/src ./src
COPY --chown=appuser:appgroup  --from=builder /app/package.json ./

# Add in dynatrace layer
COPY --from=khw46367.live.dynatrace.com/linux/oneagent-codemodules-musl:nodejs / /
ENV LD_PRELOAD=/opt/dynatrace/oneagent/agent/lib64/liboneagentproc.so

ENV PORT=8080

HEALTHCHECK --interval=5s --timeout=2s --retries=10 \
  CMD curl -f http://localhost:8080/healthcheck || exit 1

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "export DT_HOST_ID=PASSPORT-FRONT-$RANDOM && tini npm start"]
