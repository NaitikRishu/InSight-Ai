# 1. USE NODE 20 - This is the fix for the 'undici' error
FROM node:20

WORKDIR /app

# Install dependencies needed for Puppeteer/Chromium
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    libgconf-2-4 \
    libasound2 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgcc1 \
    libgdk-pixbuf2.0-0 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    lsb-release \
    libnss3 \
    libnss3-dev \
    libxshmfence1 \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# 2. COPY ONLY package.json - This is the fix for the lock file error
COPY package.json ./

# npm install will download the bundled Chromium browser
RUN npm install

COPY . .

EXPOSE 5001

# Run with nodemon (from devDependencies) for hot-reloading
CMD ["npm", "run", "dev"]