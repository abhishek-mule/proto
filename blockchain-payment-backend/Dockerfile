# Node 20 for runtime
FROM node:20-alpine

WORKDIR /app

# Install production deps
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source
COPY . .

ENV NODE_ENV=production

# Healthcheck to /health
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD node -e "require('http').get('http://127.0.0.1:'+(process.env.PORT||5001)+'/health', r=>{if(r.statusCode!==200)process.exit(1)}).on('error',()=>process.exit(1))"

EXPOSE 5001

CMD ["npm","start"]
