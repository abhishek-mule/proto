# Use official Node.js 20 LTS
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Bundle app source
COPY . .

# Environment
ENV NODE_ENV=production

# Health check (container-level)
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD node -e "require('http').get('http://127.0.0.1:'+(process.env.PORT||5000)+'/health', r=>{if(r.statusCode!==200)process.exit(1)}).on('error',()=>process.exit(1))"

# Expose port
EXPOSE 5000

# Start
CMD ["npm","start"]
