/**
 * Dummy API Configuration
 * Public test APIs for learning and testing purposes
 */

export const DUMMY_APIS = {
  // JSONPlaceholder - Fake REST API for testing
  JSON_PLACEHOLDER: {
    baseUrl: 'https://jsonplaceholder.typicode.com',
    endpoints: {
      posts: '/posts',
      comments: '/comments',
      albums: '/albums',
      photos: '/photos',
      todos: '/todos',
      users: '/users',
    },
    description: 'Simple REST API for testing. Supports GET, POST, PUT, DELETE.',
  },

  // ReqRes - REST API for testing
  REQRES: {
    baseUrl: 'https://reqres.in/api',
    endpoints: {
      users: '/users',
      login: '/login',
      register: '/register',
      singleUser: '/users/{id}',
    },
    description: 'REST API with authentication endpoints. Good for auth testing.',
  },

  // DummyJSON - Fake REST API with products and auth
  DUMMY_JSON: {
    baseUrl: 'https://dummyjson.com',
    endpoints: {
      products: '/products',
      singleProduct: '/products/{id}',
      authLogin: '/auth/login',
      authRefresh: '/auth/refresh',
      users: '/users',
      carts: '/carts',
      orders: '/orders',
    },
    description: 'REST API with products, authentication, and e-commerce endpoints.',
  },
};

/**
 * Get API base URL based on environment or default
 */
export const getApiBaseUrl = () => {
  return Cypress.env('API_BASE_URL') || DUMMY_APIS.DUMMY_JSON.baseUrl;
};

/**
 * Get endpoint URL
 * @param {string} api - API name (DUMMY_JSON, REQRES, JSON_PLACEHOLDER)
 * @param {string} endpoint - Endpoint name
 * @param {object} params - URL parameters to replace
 */
export const getEndpointUrl = (api, endpoint, params = {}) => {
  const apiConfig = DUMMY_APIS[api];
  if (!apiConfig) {
    throw new Error(`Unknown API: ${api}`);
  }

  let url = apiConfig.endpoints[endpoint] || endpoint;
  
  // Replace parameters in URL (e.g., {id} -> 1)
  Object.keys(params).forEach((key) => {
    url = url.replace(`{${key}}`, params[key]);
  });

  return `${apiConfig.baseUrl}${url}`;
};

