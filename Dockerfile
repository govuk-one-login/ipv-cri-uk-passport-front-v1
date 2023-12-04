FROM node:21.3.0-alpine3.17@sha256:ba3023de64f1aa981312e0d15b892072716c3dd6beb38d33797ecec19f572678 AS builder
WORKDIR /app
RUN [ "yarn", "set", "version", "1.22.17" ]
COPY .yarn ./.yarn
COPY /src ./src
COPY package.json yarn.lock .yarnrc.yml ./

RUN yarn install
RUN yarn build

# 'yarn install --production' does not prune test packages which are necessary
# to build the app. So delete nod_modules and reinstall only production packages.
RUN [ "rm", "-rf", "node_modules" ]
RUN yarn install --production

FROM node:21.3.0-alpine3.17@sha256:ba3023de64f1aa981312e0d15b892072716c3dd6beb38d33797ecec19f572678 AS final
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

RUN ["apk", "--no-cache", "upgrade"]
RUN ["apk", "add", "--no-cache", "tini"]
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
EXPOSE 8080

ENTRYPOINT ["tini", "--"]

CMD ["yarn", "start"]
