const { defineConfig } = require("cypress");

module.exports = defineConfig({
  env: {
    USER_NAME: "princiya",
    PASSWORD: "princiya123" 
  },
  e2e: {
    baseUrl : 'https://www.demoblaze.com',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
