FROM mcr.microsoft.com/playwright:v1.65.1-noble

WORKDIR /work

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

CMD ["npm", "test"]
