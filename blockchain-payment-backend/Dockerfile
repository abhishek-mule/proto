# Node 20 for runtime
FROM node:20-alpine

WORKDIR /app

# Install production deps (use correct subdirectory paths since build context is repo root)
COPY blockchain-payment-backend/package*.json ./
RUN npm ci --omit=dev

# Copy service source only
COPY blockchain-payment-backend/. .

ENV NODE_ENV=production

# Healthcheck to /health (uses PORT provided by Render)
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD node -e "require('http').get('http://127.0.0.1:'+(process.env.PORT||5000)+'/health', r=>{if(r.statusCode!==200)process.exit(1)}).on('error',()=>process.exit(1))"

# Expose is informational; Render routes to $PORT
EXPOSE 5000

CMD ["npm","start"]
