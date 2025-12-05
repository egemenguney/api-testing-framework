/// <reference types="cypress" />

/**
 * Products API Tests using DummyJSON API
 * API: https://dummyjson.com
 * 
 * Note: DummyJSON is a dummy API for testing purposes
 */

describe('Products API Tests (DummyJSON)', () => {
  const API_BASE = 'https://dummyjson.com';
  let createdProductId;

  beforeEach(() => {
    cy.fixture('products').as('products');
  });

  describe('GET /products - List Products', () => {
    it('should retrieve all products', () => {
      cy.apiRequest('GET', `${API_BASE}/products`).then((response) => {
        cy.assertApiResponse(response, 200);
        expect(response.body).to.have.property('products');
        expect(response.body).to.have.property('total');
        expect(response.body.products).to.be.an('array');
        expect(response.body.products.length).to.be.greaterThan(0);
      });
    });

    it('should support pagination with limit', () => {
      cy.apiRequest('GET', `${API_BASE}/products`, {
        qs: { limit: 5 },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.products.length).to.be.at.most(5);
        expect(response.body.limit).to.eq(5);
      });
    });

    it('should support pagination with skip', () => {
      cy.apiRequest('GET', `${API_BASE}/products`, {
        qs: { skip: 10, limit: 5 },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.skip).to.eq(10);
        expect(response.body.products.length).to.be.at.most(5);
      });
    });

    it('should search products by query', () => {
      cy.apiRequest('GET', `${API_BASE}/products/search`, {
        qs: { q: 'phone' },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.products).to.be.an('array');
        // Search should return results (may not always contain exact match in first result)
        expect(response.body.products.length).to.be.greaterThan(0);
        // Verify search functionality works
        expect(response.body).to.have.property('total');
      });
    });

    it('should filter products by category', () => {
      cy.apiRequest('GET', `${API_BASE}/products/category/electronics`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.products).to.be.an('array');
        if (response.body.products.length > 0) {
          expect(response.body.products[0].category).to.eq('electronics');
        }
      });
    });
  });

  describe('GET /products/:id - Get Single Product', () => {
    it('should retrieve a specific product by ID', () => {
      cy.apiRequest('GET', `${API_BASE}/products/1`).then((response) => {
        cy.assertApiResponse(response, 200);
        expect(response.body).to.have.property('id');
        expect(response.body).to.have.property('title');
        expect(response.body).to.have.property('price');
        expect(response.body).to.have.property('category');
        expect(response.body.id).to.eq(1);
      });
    });

    it('should return 404 for non-existent product', () => {
      cy.apiRequest('GET', `${API_BASE}/products/99999`, {
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(404);
        expect(response.body).to.have.property('message');
      });
    });
  });

  describe('POST /products/add - Create Product', () => {
    it('should create a new product with valid data', () => {
      cy.get('@products').then((products) => {
        const newProduct = {
          title: products.validProduct.title,
          description: products.validProduct.description,
          price: products.validProduct.price,
          category: products.validProduct.category,
        };

        cy.apiRequest('POST', `${API_BASE}/products/add`, {
          body: newProduct,
        }).then((response) => {
          // DummyJSON returns 200 or 201 for POST /products/add
          expect([200, 201]).to.include(response.status);
          expect(response.body).to.have.property('id');
          expect(response.body.title).to.eq(newProduct.title);
          expect(response.body.price).to.eq(newProduct.price);
          createdProductId = response.body.id;
        });
      });
    });

    it('should handle invalid product data', () => {
      cy.get('@products').then((products) => {
        cy.apiRequest('POST', `${API_BASE}/products/add`, {
          body: products.invalidProduct,
          failOnStatusCode: false,
        }).then((response) => {
          // DummyJSON may return 200/201 (with defaults) or 400 for validation errors
          expect([200, 201, 400]).to.include(response.status);
        });
      });
    });
  });

  describe('PUT /products/:id - Update Product', () => {
    it('should update an existing product', () => {
      cy.get('@products').then((products) => {
        // Use a known product ID (1) since dummy APIs don't persist created products
        const productId = 1;
        const updateData = {
          title: products.updateProduct.title,
          price: products.updateProduct.price,
        };

        cy.apiRequest('PUT', `${API_BASE}/products/${productId}`, {
          body: updateData,
        }).then((response) => {
          cy.assertApiResponse(response, 200);
          expect(response.body.title).to.eq(updateData.title);
          expect(response.body.price).to.eq(updateData.price);
        });
      });
    });

    it('should return 404 for non-existent product', () => {
      cy.get('@products').then((products) => {
        cy.apiRequest('PUT', `${API_BASE}/products/99999`, {
          body: { title: 'Updated Product' },
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.eq(404);
        });
      });
    });
  });

  describe('DELETE /products/:id - Delete Product', () => {
    it('should delete an existing product', () => {
      // Use a known product ID (1) since dummy APIs don't persist created products
      const productId = 1;
      cy.apiRequest('DELETE', `${API_BASE}/products/${productId}`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('id');
        expect(response.body.isDeleted).to.eq(true);
      });
    });

    it('should return 404 for non-existent product', () => {
      cy.apiRequest('DELETE', `${API_BASE}/products/99999`, {
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(404);
      });
    });
  });

  describe('GET /products/categories - List Categories', () => {
    it('should retrieve all product categories', () => {
      cy.apiRequest('GET', `${API_BASE}/products/categories`).then((response) => {
        cy.assertApiResponse(response, 200);
        expect(response.body).to.be.an('array');
        expect(response.body.length).to.be.greaterThan(0);
      });
    });
  });
});
