FROM node@sha256:5373f1906319b3a1f291da5d102f4ce5c77ccbe29eb637f072b6c7b70443fc36

# Install system dependencies for Playwright and AWS CLI
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    unzip \
    libglib2.0-0 \
    libnss3 \
    libglu1 \
    libxcb1 \
    fonts-liberation \
    dbus-x11 \
    libxss1 \
    lsb-release \
    xdg-utils \
    jq \
    && rm -rf /var/lib/apt/lists/* \
    && curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" \
    && unzip awscliv2.zip \
    && ./aws/install \
    && rm -rf awscliv2.zip aws/

# Set working directory
WORKDIR /home/node

COPY . .

RUN yarn install --frozen-lockfile && \
    npx playwright install --with-deps chromium

COPY test/run-tests.sh /run-tests.sh
RUN chmod +x /run-tests.sh

ENTRYPOINT ["/run-tests.sh"]
