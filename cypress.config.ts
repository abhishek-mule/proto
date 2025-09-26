import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173", // Assuming your Vite dev server runs on this port
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
