/// <reference types="cypress" />

/**
 * Custom API command: Make authenticated request
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
 * @param {string} endpoint - API endpoint
 * @param {object} options - Request options (body, headers, etc.)
 */
Cypress.Commands.add('apiRequest', (method, endpoint, options = {}) => {
  const { body, headers = {}, failOnStatusCode = true, qs } = options;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  // Add auth token if available
  const authToken = Cypress.env('AUTH_TOKEN') || options.token;
  if (authToken) {
    defaultHeaders['Authorization'] = `Bearer ${authToken}`;
  }

  // Add API key if available
  const apiKey = Cypress.env('API_KEY');
  if (apiKey) {
    defaultHeaders['X-API-Key'] = apiKey;
  }

  const requestOptions = {
    method,
    url: endpoint,
    headers: { ...defaultHeaders, ...headers },
    failOnStatusCode,
    ...(body && { body }),
    ...(qs && { qs }),
  };

  return cy.request(requestOptions);
});

/**
 * Custom command: Login and store token
 * @param {string} email - User email
 * @param {string} password - User password
 */
Cypress.Commands.add('apiLogin', (email, password) => {
  return cy.apiRequest('POST', '/auth/login', {
    body: { email, password },
  }).then((response) => {
    expect(response.status).to.eq(200);
    const token = response.body.token || response.body.data?.token;
    if (token) {
      Cypress.env('AUTH_TOKEN', token);
    }
    return response;
  });
});

/**
 * Custom command: Assert API response structure
 * @param {object} response - Cypress response object
 * @param {number} expectedStatus - Expected HTTP status code
 * @param {object} schema - Expected response schema (optional)
 */
Cypress.Commands.add('assertApiResponse', (response, expectedStatus = 200, schema = null) => {
  expect(response.status).to.eq(expectedStatus);
  expect(response.headers['content-type']).to.include('application/json');
  
  if (schema) {
    // Basic schema validation
    Object.keys(schema).forEach((key) => {
      expect(response.body).to.have.property(key);
      if (typeof schema[key] === 'object' && schema[key] !== null) {
        expect(response.body[key]).to.be.an('object');
      }
    });
  }
  
  return response;
});

/**
 * Custom command: Assert error response
 * @param {object} response - Cypress response object
 * @param {number} expectedStatus - Expected error status code
 * @param {string} expectedMessage - Expected error message (optional)
 */
Cypress.Commands.add('assertErrorResponse', (response, expectedStatus, expectedMessage = null) => {
  expect(response.status).to.eq(expectedStatus);
  expect(response.body).to.have.property('error');
  
  if (expectedMessage) {
    expect(response.body.error).to.include(expectedMessage);
  }
  
  return response;
});

/**
 * Custom command: Wait for async operation
 * @param {function} condition - Function that returns a promise
 * @param {number} timeout - Timeout in ms
 */
Cypress.Commands.add('waitForAsync', (condition, timeout = 5000) => {
  const startTime = Date.now();
  
  const check = () => {
    return condition().then((result) => {
      if (result) {
        return result;
      }
      if (Date.now() - startTime > timeout) {
        throw new Error('Async operation timeout');
      }
      return cy.wait(500).then(check);
    });
  };
  
  return check();
});

