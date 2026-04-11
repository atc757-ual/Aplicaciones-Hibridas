import { defineConfig } from "cypress";

export default defineConfig({
  allowCypressEnv: false,

  component: {
    devServer: {
      framework: "angular",
      bundler: "webpack",
    },
    specPattern: "**/*.cy.ts",
  },

  e2e: {
    baseUrl: "http://localhost:8100",
    specPattern: "cypress/e2e/**/*.cy.{ts,js}",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
