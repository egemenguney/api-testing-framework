const { defineConfig } = require('cypress');
require('dotenv').config();

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.API_BASE_URL || 'https://dummyjson.com',
    setupNodeEvents(on, config) {
      // Allure reporter is optional - uncomment if you install it
      // try {
      //   require('@shelex/cypress-allure-plugin/on')(on, config);
      // } catch (error) {
      //   console.log('Allure plugin not found, continuing without it...');
      // }
      return config;
    },
    specPattern: 'cypress/e2e/**/*.spec.js',
    supportFile: 'cypress/support/e2e.js',
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
  },
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: 'cypress/reports',
    overwrite: false,
    html: true,
    json: true,
    timestamp: 'mmddyyyy_HHMMss',
  },
});

