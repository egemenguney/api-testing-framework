/// <reference types="cypress" />

/**
 * Orders API Tests using JSONPlaceholder and DummyJSON APIs
 * 
 * JSONPlaceholder: https://jsonplaceholder.typicode.com
 * - Using /posts endpoint to simulate orders
 * 
 * DummyJSON: https://dummyjson.com
 * - Using /carts endpoint for cart/order operations
 * 
 * Note: These are dummy APIs for testing purposes
 */

describe('Orders API Tests (JSONPlaceholder & DummyJSON)', () => {
  const JSON_PLACEHOLDER_BASE = 'https://jsonplaceholder.typicode.com';
  const DUMMY_JSON_BASE = 'https://dummyjson.com';

  beforeEach(() => {
    cy.fixture('orders').as('orders');
  });

  describe('JSONPlaceholder - Posts as Orders Simulation', () => {
    describe('GET /posts - List Orders (Posts)', () => {
      it('should retrieve all orders (posts)', () => {
        cy.apiRequest('GET', `${JSON_PLACEHOLDER_BASE}/posts`).then((response) => {
          cy.assertApiResponse(response, 200);
          expect(response.body).to.be.an('array');
          expect(response.body.length).to.be.greaterThan(0);
          // Each post has id, userId, title, body
          expect(response.body[0]).to.have.property('id');
          expect(response.body[0]).to.have.property('userId');
          expect(response.body[0]).to.have.property('title');
        });
      });

      it('should support pagination with query params', () => {
        cy.apiRequest('GET', `${JSON_PLACEHOLDER_BASE}/posts`, {
          qs: { _limit: 5 },
        }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.length).to.be.at.most(5);
        });
      });
    });

    describe('GET /posts/:id - Get Single Order', () => {
      it('should retrieve a specific order (post) by ID', () => {
        cy.apiRequest('GET', `${JSON_PLACEHOLDER_BASE}/posts/1`).then((response) => {
          cy.assertApiResponse(response, 200);
          expect(response.body).to.have.property('id');
          expect(response.body).to.have.property('userId');
          expect(response.body).to.have.property('title');
          expect(response.body).to.have.property('body');
          expect(response.body.id).to.eq(1);
        });
      });

      it('should return 404 for non-existent order', () => {
        cy.apiRequest('GET', `${JSON_PLACEHOLDER_BASE}/posts/99999`, {
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.eq(404);
        });
      });
    });

    describe('POST /posts - Create Order', () => {
      it('should create a new order (post)', () => {
        const newOrder = {
          title: 'New Order',
          body: 'Order details here',
          userId: 1,
        };

        cy.apiRequest('POST', `${JSON_PLACEHOLDER_BASE}/posts`, {
          body: newOrder,
        }).then((response) => {
          cy.assertApiResponse(response, 201);
          expect(response.body).to.have.property('id');
          expect(response.body.title).to.eq(newOrder.title);
          expect(response.body.body).to.eq(newOrder.body);
          expect(response.body.userId).to.eq(newOrder.userId);
        });
      });

      it('should handle missing required fields', () => {
        cy.apiRequest('POST', `${JSON_PLACEHOLDER_BASE}/posts`, {
          body: { title: 'Incomplete Order' },
          failOnStatusCode: false,
        }).then((response) => {
          // JSONPlaceholder may still return 201 with defaults
          expect([201, 400]).to.include(response.status);
        });
      });
    });

    describe('PUT /posts/:id - Update Order', () => {
      it('should update an existing order (post)', () => {
        const updateData = {
          id: 1,
          title: 'Updated Order',
          body: 'Updated order details',
          userId: 1,
        };

        cy.apiRequest('PUT', `${JSON_PLACEHOLDER_BASE}/posts/1`, {
          body: updateData,
        }).then((response) => {
          cy.assertApiResponse(response, 200);
          expect(response.body.title).to.eq(updateData.title);
          expect(response.body.body).to.eq(updateData.body);
        });
      });
    });

    describe('DELETE /posts/:id - Delete Order', () => {
      it('should delete an existing order (post)', () => {
        cy.apiRequest('DELETE', `${JSON_PLACEHOLDER_BASE}/posts/1`).then((response) => {
          expect(response.status).to.eq(200);
        });
      });
    });

    describe('GET /posts/:id/comments - Get Order Comments', () => {
      it('should retrieve comments for an order (post)', () => {
        cy.apiRequest('GET', `${JSON_PLACEHOLDER_BASE}/posts/1/comments`).then((response) => {
          cy.assertApiResponse(response, 200);
          expect(response.body).to.be.an('array');
          if (response.body.length > 0) {
            expect(response.body[0]).to.have.property('id');
            expect(response.body[0]).to.have.property('postId');
            expect(response.body[0]).to.have.property('email');
          }
        });
      });
    });
  });

  describe('DummyJSON - Carts/Orders', () => {
    describe('GET /carts - List Carts', () => {
      it('should retrieve all carts', () => {
        cy.apiRequest('GET', `${DUMMY_JSON_BASE}/carts`).then((response) => {
          cy.assertApiResponse(response, 200);
          expect(response.body).to.have.property('carts');
          expect(response.body.carts).to.be.an('array');
          expect(response.body).to.have.property('total');
        });
      });

      it('should support pagination', () => {
        cy.apiRequest('GET', `${DUMMY_JSON_BASE}/carts`, {
          qs: { limit: 5 },
        }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.carts.length).to.be.at.most(5);
        });
      });
    });

    describe('GET /carts/:id - Get Single Cart', () => {
      it('should retrieve a specific cart by ID', () => {
        cy.apiRequest('GET', `${DUMMY_JSON_BASE}/carts/1`).then((response) => {
          cy.assertApiResponse(response, 200);
          expect(response.body).to.have.property('id');
          expect(response.body).to.have.property('products');
          expect(response.body).to.have.property('total');
          expect(response.body.id).to.eq(1);
        });
      });

      it('should return 404 for non-existent cart', () => {
        cy.apiRequest('GET', `${DUMMY_JSON_BASE}/carts/99999`, {
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.eq(404);
        });
      });
    });

    describe('POST /carts/add - Add to Cart', () => {
      it('should add products to cart', () => {
        const cartData = {
          userId: 1,
          products: [
            {
              id: 1,
              quantity: 2,
            },
          ],
        };

        cy.apiRequest('POST', `${DUMMY_JSON_BASE}/carts/add`, {
          body: cartData,
        }).then((response) => {
          // DummyJSON returns 200 or 201 for POST /carts/add
          expect([200, 201]).to.include(response.status);
          expect(response.headers['content-type']).to.include('application/json');
          expect(response.body).to.have.property('id');
          expect(response.body).to.have.property('products');
          expect(response.body.products).to.be.an('array');
        });
      });
    });

    describe('PUT /carts/:id - Update Cart', () => {
      it('should update an existing cart', () => {
        const updateData = {
          merge: true,
          products: [
            {
              id: 1,
              quantity: 3,
            },
          ],
        };

        cy.apiRequest('PUT', `${DUMMY_JSON_BASE}/carts/1`, {
          body: updateData,
        }).then((response) => {
          cy.assertApiResponse(response, 200);
          expect(response.body).to.have.property('products');
        });
      });
    });

    describe('DELETE /carts/:id - Delete Cart', () => {
      it('should delete an existing cart', () => {
        cy.apiRequest('DELETE', `${DUMMY_JSON_BASE}/carts/1`).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.have.property('id');
          expect(response.body.isDeleted).to.eq(true);
        });
      });
    });
  });
});
