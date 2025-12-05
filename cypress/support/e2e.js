// Import commands
import './commands';
import './dummy-api-config';

// Global test configuration
beforeEach(() => {
  // Clear cookies and localStorage before each test
  cy.clearCookies();
  cy.clearLocalStorage();
});

