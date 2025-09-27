# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Project overview
- This repo contains a Vite + React + TypeScript frontend at the root and two Node.js backends:
  - agri-blockchain-backend: Express API with MongoDB, Socket.IO, cron-driven price oracle, and payment/NFT flows.
  - blockchain-payment-backend: Express API with enhanced security middleware, public PWA assets, and Hardhat-based smart contracts (contracts/, scripts/deploy.js). Includes CI for contract deploys.
- Primary data store: MongoDB (see env.example files in each backend).
- Smart contracts: Hardhat project in blockchain-payment-backend (contracts/, hardhat.config.js). Dockerfile provided to run a local Hardhat node.

Key commands
Use npm (lockfiles present). Run commands from the directory noted in each section.

Frontend (root)
- Install: npm install
- Dev server (http://localhost:5173): npm run dev
- Build: npm run build
- Preview production build: npm run preview
- Lint: npm run lint
- E2E tests (Cypress):
  - Open GUI: npm run cypress:open
  - Run a single spec (headless): npx cypress run --spec "cypress/e2e/<spec>.cy.ts"

agri-blockchain-backend
- Directory: agri-blockchain-backend
- Install: npm install
- Start (prod): npm start
- Start (dev, with nodemon): npm run dev
- Tests (Jest): npm test
- Hardhat deploy/verify (Polygon):
  - Deploy: npm run deploy
  - Verify: npm run verify
- Env setup: Copy env.example to .env and set values
  - PowerShell: Copy-Item env.example .env

blockchain-payment-backend
- Directory: blockchain-payment-backend
- Install: npm install
- Start (prod): npm start
- Start (dev, with nodemon): npm run dev
- Tests (Jest): npm test
- Hardhat commands:
  - Compile: npx hardhat compile
  - Local node: npx hardhat node (exposes 8545)
  - Deploy to Amoy testnet: npx hardhat run scripts/deploy.js --network amoy
- Docker (local Hardhat node):
  - Build: docker build -t payment-hardhat .
  - Run: docker run -p 8545:8545 payment-hardhat
- CI deploy (GitHub Actions): push to main triggers compile and npx hardhat run scripts/deploy.js --network amoy. Requires secrets: PRIVATE_KEY, POLYGONSCAN_API_KEY.
- Env setup: Copy env.example (or .env.template) to .env and set values
  - PowerShell: Copy-Item env.example .env

Running a single unit test (Jest)
- From the respective backend directory:
  - By file: npx jest path/to/file.test.js
  - By test name: npx jest -t "test name"

Architecture notes
Frontend (Vite + React + TS)
- Routing/UI: React components are grouped by domain under src/components (e.g., farmer, consumer, payments, analytics). React Router is used (react-router-dom).
- State/context: Authentication context at src/contexts/AuthContext.tsx.
- Service layer: REST/Web3 logic under src/services (apiService.ts, authService.ts, priceOracleService.ts, web3Service.ts, etc.). Shared types in src/types.
- Web3 integration: src/services/web3Service.ts uses MetaMask SDK and ethers BrowserProvider for wallet connect, signing, sending transactions, and network switching.
- PWA: registerSW.ts and PWA-related components (src/components/PWA*). Cypress configured with baseUrl http://localhost:5173 (cypress.config.ts).

agri-blockchain-backend
- Express app (server.js) with layers:
  - routes: src/routes (auth, payment, blockchain, priceOracle, crop, ai)
  - services: src/services (paymentService, blockchainService, ipfsService, priceOracleService, socketService)
  - models: src/models (User, Crop, Payment, Transaction, Refund, Webhook, Notification*, AuditLog, etc.)
  - middleware: src/middleware (auth, validation)
  - config: src/config (database, blockchain, oracle, payment, ai)
  - utils: src/utils (logger, response)
- Realtime: Socket.IO initialization and request attachment; events used by services.
- Infra concerns: Helmet, CORS, rate limiting, global error handler and 404; cron schedule updates price oracle every 15 minutes.
- Webhook: raw body route under /api/webhook for Razorpay.

blockchain-payment-backend
- Express app (server.js) with a hardened middleware stack: helmet CSP, CORS with origin allowlist, rate limiting per-route group (general/auth/blockchain), mongo-sanitize, xss-clean, hpp, structured logging (winston).
- Modules:
  - routes: auth, blockchain, payment, ipfs, fiatCrypto, priceOracle, narrative, geoLocation, pushNotifications
  - services: fiatCryptoService, priceOracleService, ipfsService, narrativeService, pushNotificationService
  - models: User, Payment, Subscription
- Static client hosting: serves public/ (includes service worker, manifest, and assets). SPA fallback for non-/api routes.
- Hardhat: contracts/ (CropNFT.sol, Payment.sol, etc.), scripts/deploy.js, hardhat.config.js with network "amoy" and Etherscan config.

Environment and configuration
- Frontend dev server: http://localhost:5173 (Vite default; used by Cypress baseUrl).
- Backends default ports: agri-blockchain-backend uses PORT (defaults to 5000); blockchain-payment-backend uses PORT (env.example shows 5001).
- Required environment variables: see env.example files in each backend for MongoDB URI, blockchain RPC/keys, payment/AI/IPFS keys, CORS origins. Copy to .env before running services.

Cross-service interactions
- Frontend -> APIs: service layer calls backend routes like /api/payment, /api/blockchain, /api/price-oracle. Configure the frontend base API URL via VITE_API_URL (see agri-blockchain-backend/env.example) and align CORS origins in the backends.
- Price oracle: both backends expose price/oracle endpoints; ensure the intended API is targeted by the frontend services.
