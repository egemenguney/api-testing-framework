# 🚀 API Testing Framework

Cypress ve JavaScript tabanlı, kapsamlı RESTful API test framework'ü.

**🎓 Learning Project**: Bu framework, gerçek API endpoint'leri olmadan öğrenme amaçlı hazırlanmıştır. Testler için ücretsiz public dummy API'ler kullanılmaktadır.

## 📋 İçindekiler

- [Özellikler](#özellikler)
- [Kullanılan Dummy API'ler](#kullanılan-dummy-apiler)
- [Kurulum](#kurulum)
- [Kullanım](#kullanım)
- [Proje Yapısı](#proje-yapısı)
- [Test Senaryoları](#test-senaryoları)
- [Raporlama](#raporlama)
- [CI/CD](#cicd)

## ✨ Özellikler

- ✅ **Cypress** ile API testleri
- ✅ **Dummy API Entegrasyonu** - Gerçek API'ye ihtiyaç yok
- ✅ **Modüler yapı** - Kolay genişletilebilir
- ✅ **Custom Commands** - Tekrar kullanılabilir API helper'ları
- ✅ **Fixtures** - Test data yönetimi
- ✅ **Raporlama** - Mochawesome + Allure desteği
- ✅ **Error Handling** - Kapsamlı hata senaryoları
- ✅ **CI/CD Ready** - GitHub Actions entegrasyonu

## 🌐 Kullanılan Dummy API'ler

Bu framework, öğrenme amaçlı olarak aşağıdaki ücretsiz public API'leri kullanmaktadır:

### 1. **DummyJSON** (https://dummyjson.com)
- **Kullanım**: Products, Authentication, Carts
- **Endpoint'ler**: `/products`, `/auth/login`, `/carts`
- **Özellikler**: E-commerce senaryoları için kapsamlı endpoint'ler

### 2. **ReqRes** (https://reqres.in)
- **Kullanım**: Authentication, User Management
- **Endpoint'ler**: `/api/login`, `/api/register`, `/api/users`
- **Özellikler**: Auth testleri için ideal

### 3. **JSONPlaceholder** (https://jsonplaceholder.typicode.com)
- **Kullanım**: Posts, Comments (Orders simülasyonu)
- **Endpoint'ler**: `/posts`, `/comments`, `/users`
- **Özellikler**: CRUD işlemleri için basit ve anlaşılır

## 🛠️ Kurulum

### Gereksinimler

- Node.js (v16+)
- npm veya yarn

### Adımlar

1. **Bağımlılıkları yükleyin:**

```bash
npm install
```

2. **Environment dosyasını oluşturun:**

```bash
cp .env.example .env
```

3. **`.env` dosyasını oluşturun (opsiyonel):**

```bash
# Dummy API'ler için .env dosyası gerekli değil
# Ancak kendi API'nizi kullanmak isterseniz:
API_BASE_URL=https://dummyjson.com
# API_KEY ve AUTH_TOKEN dummy API'ler için gerekli değil
```

**Not**: Dummy API'ler için environment değişkenleri gerekli değildir. Framework varsayılan olarak DummyJSON API'sini kullanır.

## 🎯 Kullanım

### Testleri Çalıştırma

```bash
# Tüm testleri çalıştır
npm test

# Headed mode (tarayıcı ile)
npm run test:headed

# Chrome'da çalıştır
npm run test:chrome

# Rapor ile çalıştır
npm run test:report

# Allure raporu ile çalıştır
npm run test:allure
```

### Cypress UI'ı Açma

```bash
npm run cy:open
```

## 📁 Proje Yapısı

```
api-testing-framework/
├── cypress/
│   ├── e2e/                    # Test dosyaları
│   │   ├── auth.spec.js        # Authentication testleri
│   │   ├── products.spec.js    # Products API testleri
│   │   ├── orders.spec.js      # Orders API testleri
│   │   └── error-handling.spec.js  # Error handling testleri
│   ├── fixtures/               # Test data
│   │   ├── users.json
│   │   ├── products.json
│   │   └── orders.json
│   └── support/                # Custom commands ve helpers
│       ├── e2e.js
│       ├── commands.js
│       └── dummy-api-config.js
├── cypress.config.js           # Cypress yapılandırması
├── package.json
├── .env.example
└── README.md
```

## 🧪 Test Senaryoları

### Authentication (`auth.spec.js`) - ReqRes & DummyJSON

- ✅ Valid login (ReqRes & DummyJSON)
- ✅ Invalid credentials
- ✅ Missing fields validation
- ✅ User registration (ReqRes)
- ✅ Token validation

**Kullanılan API'ler:**
- ReqRes: `/api/login`, `/api/register`
- DummyJSON: `/auth/login`

### Products (`products.spec.js`) - DummyJSON

- ✅ List products (GET)
- ✅ Get single product (GET)
- ✅ Create product (POST)
- ✅ Update product (PUT)
- ✅ Delete product (DELETE)
- ✅ Pagination & Search
- ✅ Category filtering
- ✅ List categories

**Kullanılan API:** DummyJSON `/products`

### Orders (`orders.spec.js`) - JSONPlaceholder & DummyJSON

- ✅ Create order/post (POST)
- ✅ List orders/posts (GET)
- ✅ Get single order/post (GET)
- ✅ Update order/post (PUT)
- ✅ Delete order/post (DELETE)
- ✅ Get order comments
- ✅ Cart operations (DummyJSON)

**Kullanılan API'ler:**
- JSONPlaceholder: `/posts`, `/comments`
- DummyJSON: `/carts`

### Error Handling (`error-handling.spec.js`) - All APIs

- ✅ 4xx Client Errors (400, 404)
- ✅ Request validation
- ✅ Edge cases (SQL injection, XSS, etc.)
- ✅ Invalid data formats
- ✅ Pagination errors

## 📊 Raporlama

### Mochawesome

HTML raporları otomatik olarak `cypress/reports/` dizininde oluşturulur:

```bash
npm run test:report
```

Rapor dosyası: `cypress/reports/mochawesome.html`

### Allure (Opsiyonel)

```bash
npm run test:allure
```

Bu komut:
1. Testleri çalıştırır
2. Allure raporunu oluşturur
3. Raporu otomatik açar

## 🔧 Custom Commands

Framework, aşağıdaki custom command'ları sağlar:

### `cy.apiRequest(method, endpoint, options)`

Genel API isteği yapar:

```javascript
cy.apiRequest('GET', '/products', {
  token: 'auth-token',
  qs: { page: 1, limit: 10 }
});
```

### `cy.apiLogin(email, password)`

Login yapar ve token'ı saklar:

```javascript
cy.apiLogin('user@example.com', 'password123');
```

### `cy.assertApiResponse(response, status, schema)`

API response'unu doğrular:

```javascript
cy.apiRequest('GET', '/products/1').then((response) => {
  cy.assertApiResponse(response, 200, {
    product: 'object',
    id: 'number'
  });
});
```

### `cy.assertErrorResponse(response, status, message)`

Hata response'unu doğrular:

```javascript
cy.apiRequest('POST', '/auth/login', {
  body: { email: 'invalid' },
  failOnStatusCode: false
}).then((response) => {
  cy.assertErrorResponse(response, 400, 'Invalid email');
});
```

## 🚀 CI/CD

### GitHub Actions

Proje, GitHub Actions ile CI/CD'ye hazırdır. `.github/workflows/ci.yml` dosyasına bakın.

Workflow:
1. Testleri çalıştırır
2. Raporları oluşturur
3. Sonuçları yorumlar

## 📝 Best Practices

1. **Test Data**: Fixtures kullanarak test data'sını yönetin
2. **Custom Commands**: Tekrar eden işlemler için custom command'lar oluşturun
3. **Assertions**: `assertApiResponse` ve `assertErrorResponse` kullanın
4. **Environment Variables**: Hassas bilgileri `.env` dosyasında saklayın
5. **Modular Tests**: Her API endpoint'i için ayrı test dosyası oluşturun

## 🔍 Örnek Test

### DummyJSON ile Product Testi

```javascript
describe('Products API (DummyJSON)', () => {
  it('should get all products', () => {
    cy.apiRequest('GET', 'https://dummyjson.com/products').then((response) => {
      cy.assertApiResponse(response, 200);
      expect(response.body.products).to.be.an('array');
      expect(response.body.total).to.be.greaterThan(0);
    });
  });

  it('should create a product', () => {
    cy.fixture('products').then((products) => {
      cy.apiRequest('POST', 'https://dummyjson.com/products/add', {
        body: {
          title: products.validProduct.title,
          price: products.validProduct.price,
          category: products.validProduct.category,
        }
      }).then((response) => {
        cy.assertApiResponse(response, 200);
        expect(response.body.title).to.eq(products.validProduct.title);
      });
    });
  });
});
```

### ReqRes ile Auth Testi

```javascript
describe('Auth API (ReqRes)', () => {
  it('should login successfully', () => {
    cy.apiRequest('POST', 'https://reqres.in/api/login', {
      body: {
        email: 'eve.holt@reqres.in',
        password: 'cityslicka'
      }
    }).then((response) => {
      cy.assertApiResponse(response, 200);
      expect(response.body.token).to.be.a('string');
    });
  });
});
```

## 📚 Kaynaklar

### Framework Dokümantasyonu
- [Cypress Documentation](https://docs.cypress.io/)
- [Cypress API Testing](https://docs.cypress.io/guides/guides/network-requests)
- [Mochawesome](https://github.com/adamgruber/mochawesome)

### Kullanılan Dummy API'ler
- [DummyJSON API Docs](https://dummyjson.com/docs)
- [ReqRes API Docs](https://reqres.in/)
- [JSONPlaceholder API Docs](https://jsonplaceholder.typicode.com/)

## 🔄 Gerçek API'ye Geçiş

Kendi API'nizi kullanmak isterseniz:

1. `.env` dosyasını oluşturun:
```env
API_BASE_URL=https://your-api.com
API_KEY=your_api_key
AUTH_TOKEN=your_token
```

2. Test dosyalarındaki endpoint'leri güncelleyin
3. Fixtures'ları kendi API response formatınıza göre düzenleyin

## 📄 Lisans

MIT

---

**🎓 Learning Project**: Bu framework öğrenme amaçlıdır ve ücretsiz public dummy API'ler kullanmaktadır. Gerçek bir projede kendi API endpoint'lerinizi kullanabilirsiniz.

#   a p i - t e s t i n g - f r a m e w o r k 
 
 
