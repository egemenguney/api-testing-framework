/// <reference types="cypress" />

/**
 * Error Handling API Tests using Dummy APIs
 * Testing various error scenarios with JSONPlaceholder, ReqRes, and DummyJSON
 */

describe('Error Handling API Tests', () => {
  const JSON_PLACEHOLDER_BASE = 'https://jsonplaceholder.typicode.com';
  const REQRES_BASE = 'https://reqres.in/api';
  const DUMMY_JSON_BASE = 'https://dummyjson.com';

  describe('4xx Client Errors', () => {
    it('should handle 400 Bad Request - Missing required fields', () => {
      cy.apiRequest('POST', `${REQRES_BASE}/login`, {
        body: { email: 'test@example.com' }, // Missing password
        failOnStatusCode: false,
      }).then((response) => {
        // ReqRes may return 403 (Cloudflare) or 400 (validation error)
        expect([400, 403]).to.include(response.status);
      });
    });

    it('should handle 400 Bad Request - Invalid data format', () => {
      cy.apiRequest('POST', `${DUMMY_JSON_BASE}/auth/login`, {
        body: {
          username: '', // Empty username
          password: '',
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.have.property('message');
      });
    });

    it('should handle 401 Unauthorized - Invalid credentials', () => {
      cy.apiRequest('POST', `${DUMMY_JSON_BASE}/auth/login`, {
        body: {
          username: 'invalid',
          password: 'wrongpassword',
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400); // DummyJSON returns 400 for invalid credentials
        expect(response.body).to.have.property('message');
      });
    });

    it('should handle 404 Not Found - Non-existent resource', () => {
      cy.apiRequest('GET', `${DUMMY_JSON_BASE}/products/99999`, {
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(404);
        expect(response.body).to.have.property('message');
      });
    });

    it('should handle 404 Not Found - Invalid endpoint', () => {
      cy.apiRequest('GET', `${JSON_PLACEHOLDER_BASE}/nonexistent`, {
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(404);
      });
    });
  });

  describe('Request Validation', () => {
    it('should validate required fields - Missing email', () => {
      cy.apiRequest('POST', `${REQRES_BASE}/login`, {
        body: { password: 'password123' },
        failOnStatusCode: false,
      }).then((response) => {
        // ReqRes may return 403 (Cloudflare) or 400 (validation error)
        expect([400, 403]).to.include(response.status);
      });
    });

    it('should validate required fields - Missing password', () => {
      cy.apiRequest('POST', `${REQRES_BASE}/login`, {
        body: { email: 'test@example.com' },
        failOnStatusCode: false,
      }).then((response) => {
        // ReqRes may return 403 (Cloudflare) or 400 (validation error)
        expect([400, 403]).to.include(response.status);
      });
    });

    it('should validate field types - Invalid ID format', () => {
      cy.apiRequest('GET', `${DUMMY_JSON_BASE}/products/invalid-id`, {
        failOnStatusCode: false,
      }).then((response) => {
        // May return 400 or 404 depending on API
        expect([400, 404]).to.include(response.status);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty request body', () => {
      cy.apiRequest('POST', `${REQRES_BASE}/login`, {
        body: {},
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.be.at.least(400);
      });
    });

    it('should handle very long strings', () => {
      const longString = 'a'.repeat(1000);
      cy.apiRequest('POST', `${JSON_PLACEHOLDER_BASE}/posts`, {
        body: {
          title: longString,
          body: 'Test body',
          userId: 1,
        },
        failOnStatusCode: false,
      }).then((response) => {
        // JSONPlaceholder may accept or reject
        expect([200, 201, 400, 413]).to.include(response.status);
      });
    });

    it('should handle special characters in data', () => {
      cy.apiRequest('POST', `${JSON_PLACEHOLDER_BASE}/posts`, {
        body: {
          title: '<script>alert("xss")</script>',
          body: 'Test body with special chars: !@#$%^&*()',
          userId: 1,
        },
        failOnStatusCode: false,
      }).then((response) => {
        // Should accept or sanitize
        expect([200, 201, 400]).to.include(response.status);
      });
    });

    it('should handle SQL injection attempts', () => {
      cy.apiRequest('POST', `${REQRES_BASE}/login`, {
        body: {
          email: "admin' OR '1'='1",
          password: "password' OR '1'='1",
        },
        failOnStatusCode: false,
      }).then((response) => {
        // ReqRes may return 403 (Cloudflare), 400, or 401
        expect([400, 401, 403]).to.include(response.status);
      });
    });

    it('should handle invalid JSON in request', () => {
      // Cypress automatically handles JSON, but we can test with invalid structure
      cy.apiRequest('POST', `${REQRES_BASE}/login`, {
        body: {
          email: null,
          password: null,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.be.at.least(400);
      });
    });
  });

  describe('Pagination and Query Parameter Errors', () => {
    it('should handle invalid pagination parameters', () => {
      cy.apiRequest('GET', `${DUMMY_JSON_BASE}/products`, {
        qs: { limit: -1, skip: -1 },
        failOnStatusCode: false,
      }).then((response) => {
        // May return default values or error
        expect([200, 400]).to.include(response.status);
      });
    });

    it('should handle invalid query parameters', () => {
      cy.apiRequest('GET', `${DUMMY_JSON_BASE}/products/search`, {
        qs: { q: '' }, // Empty search query
        failOnStatusCode: false,
      }).then((response) => {
        // May return empty results or error
        expect([200, 400]).to.include(response.status);
      });
    });
  });

  describe('HTTP Method Validation', () => {
    it('should handle unsupported HTTP methods', () => {
      // Note: Cypress request doesn't support all methods, but we can test with invalid endpoints
      cy.apiRequest('PATCH', `${DUMMY_JSON_BASE}/products/1`, {
        body: { title: 'Updated' },
        failOnStatusCode: false,
      }).then((response) => {
        // May return 405 Method Not Allowed or handle as PUT
        expect([200, 400, 404, 405]).to.include(response.status);
      });
    });
  });

  describe('Rate Limiting and Server Errors', () => {
    it('should handle server errors gracefully', () => {
      // Test with invalid endpoint that might cause server error
      cy.apiRequest('GET', `${DUMMY_JSON_BASE}/invalid/endpoint/that/causes/error`, {
        failOnStatusCode: false,
      }).then((response) => {
        // Should return 404 or 500
        expect([404, 500, 503]).to.include(response.status);
      });
    });
  });

  describe('Response Time Validation', () => {
    it('should complete request within reasonable time', () => {
      const startTime = Date.now();
      
      cy.apiRequest('GET', `${DUMMY_JSON_BASE}/products`).then(() => {
        const duration = Date.now() - startTime;
        expect(duration).to.be.lessThan(10000); // Should complete within 10 seconds
      });
    });
  });
});
