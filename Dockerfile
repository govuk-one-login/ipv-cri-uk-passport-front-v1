FROM node:22.16.0-alpine3.21@sha256:4437d7c27c4b9306c577caa17577dc7b367fc320fb7469dbe2c994e23b11d11c AS builder
WORKDIR /app
RUN [ "yarn", "set", "version", "1.22.17" ]
COPY .yarn ./.yarn
COPY /src ./src
COPY package.json yarn.lock .yarnrc.yml ./

RUN yarn install --frozen-lockfile
RUN yarn build

# 'yarn install --production' prunes dev dependencies which are necessary
# to build the app. So delete node_modules and reinstall only production packages.
RUN [ "rm", "-rf", "node_modules" ]
RUN yarn install --production --frozen-lockfile

FROM node:22.16.0-alpine3.21@sha256:4437d7c27c4b9306c577caa17577dc7b367fc320fb7469dbe2c994e23b11d11c AS final
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

RUN ["apk", "--no-cache", "upgrade"]
RUN ["apk", "add", "--no-cache", "tini", "curl"]
RUN ["yarn", "set", "version", "1.22.17" ]
USER appuser:appgroup

WORKDIR /app
# Copy in compile assets and deps from build container
COPY --chown=appuser:appgroup  --from=builder /app/node_modules ./node_modules
COPY --chown=appuser:appgroup  --from=builder /app/dist ./dist
COPY --chown=appuser:appgroup  --from=builder /app/src ./src
COPY --chown=appuser:appgroup  --from=builder /app/package.json ./
COPY --chown=appuser:appgroup  --from=builder /app/yarn.lock ./

# Add in dynatrace layer
COPY --from=khw46367.live.dynatrace.com/linux/oneagent-codemodules-musl:nodejs / /
ENV LD_PRELOAD /opt/dynatrace/oneagent/agent/lib64/liboneagentproc.so

ENV PORT 8080

HEALTHCHECK --interval=5s --timeout=2s --retries=10 \
  CMD curl -f http://localhost:8080/healthcheck || exit 1

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "export DT_HOST_ID=PASSPORT-FRONT-$RANDOM && tini npm start"]

CMD ["yarn", "start"]
