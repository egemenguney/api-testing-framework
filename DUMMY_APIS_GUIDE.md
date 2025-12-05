# 🌐 Dummy API'ler Kullanım Rehberi

Bu framework, öğrenme amaçlı olarak ücretsiz public dummy API'ler kullanmaktadır. Gerçek bir API'ye ihtiyaç duymadan test yazabilir ve framework'ü öğrenebilirsiniz.

## 📚 Kullanılan API'ler

### 1. DummyJSON (https://dummyjson.com)

**Ana Kullanım Alanları:**
- ✅ Products (Ürün yönetimi)
- ✅ Authentication (Giriş işlemleri)
- ✅ Carts (Sepet işlemleri)
- ✅ Users (Kullanıcı yönetimi)

**Endpoint Örnekleri:**
```javascript
// Products
GET    /products              // Tüm ürünleri listele
GET    /products/{id}          // Tek ürün getir
POST   /products/add           // Yeni ürün ekle
PUT    /products/{id}          // Ürün güncelle
DELETE /products/{id}          // Ürün sil
GET    /products/search?q=...  // Ürün ara
GET    /products/category/...  // Kategoriye göre filtrele

// Authentication
POST   /auth/login             // Giriş yap
POST   /auth/refresh           // Token yenile

// Carts
GET    /carts                  // Tüm sepetleri listele
GET    /carts/{id}             // Tek sepet getir
POST   /carts/add              // Sepete ekle
PUT    /carts/{id}             // Sepet güncelle
DELETE /carts/{id}             // Sepet sil
```

**Test Dosyası:** `cypress/e2e/products.spec.js`

**Örnek Kullanım:**
```javascript
cy.apiRequest('GET', 'https://dummyjson.com/products')
  .then((response) => {
    expect(response.body.products).to.be.an('array');
  });
```

---

### 2. ReqRes (https://reqres.in)

**Ana Kullanım Alanları:**
- ✅ Authentication (Giriş/Kayıt)
- ✅ User Management (Kullanıcı yönetimi)

**Endpoint Örnekleri:**
```javascript
// Authentication
POST   /api/login              // Giriş yap
POST   /api/register           // Kayıt ol

// Users
GET    /api/users              // Kullanıcıları listele
GET    /api/users/{id}         // Tek kullanıcı getir
POST   /api/users              // Yeni kullanıcı oluştur
PUT    /api/users/{id}         // Kullanıcı güncelle
DELETE /api/users/{id}         // Kullanıcı sil
```

**Test Dosyası:** `cypress/e2e/auth.spec.js`

**Örnek Kullanım:**
```javascript
cy.apiRequest('POST', 'https://reqres.in/api/login', {
  body: {
    email: 'eve.holt@reqres.in',
    password: 'cityslicka'
  }
}).then((response) => {
  expect(response.body.token).to.be.a('string');
});
```

**Geçerli Test Kullanıcıları:**
- Email: `eve.holt@reqres.in`, Password: `cityslicka`
- Email: `eve.holt@reqres.in`, Password: `pistol` (register için)

---

### 3. JSONPlaceholder (https://jsonplaceholder.typicode.com)

**Ana Kullanım Alanları:**
- ✅ Posts (Sipariş simülasyonu)
- ✅ Comments (Yorumlar)
- ✅ Users (Kullanıcılar)
- ✅ Albums, Photos, Todos

**Endpoint Örnekleri:**
```javascript
// Posts (Orders simülasyonu)
GET    /posts                  // Tüm postları listele
GET    /posts/{id}             // Tek post getir
POST   /posts                  // Yeni post oluştur
PUT    /posts/{id}             // Post güncelle
DELETE /posts/{id}             // Post sil
GET    /posts/{id}/comments    // Post yorumlarını getir

// Comments
GET    /comments               // Tüm yorumları listele
GET    /comments?postId={id}   // Post'a ait yorumlar

// Users
GET    /users                  // Tüm kullanıcıları listele
GET    /users/{id}             // Tek kullanıcı getir
```

**Test Dosyası:** `cypress/e2e/orders.spec.js`

**Özellikler:**
- ✅ CRUD işlemleri destekler
- ✅ Nested resources (posts/{id}/comments)
- ✅ Query parameters ile filtreleme
- ✅ Basit ve anlaşılır response formatı

**Örnek Kullanım:**
```javascript
cy.apiRequest('GET', 'https://jsonplaceholder.typicode.com/posts/1')
  .then((response) => {
    expect(response.body.id).to.eq(1);
    expect(response.body).to.have.property('title');
  });
```

---

## 🎯 Hangi API'yi Ne Zaman Kullanmalı?

### Products Testleri İçin
→ **DummyJSON** kullanın
- E-commerce senaryoları için ideal
- Kapsamlı product endpoint'leri
- Search, filter, category desteği

### Authentication Testleri İçin
→ **ReqRes** veya **DummyJSON** kullanın
- ReqRes: Basit auth senaryoları
- DummyJSON: Daha kapsamlı auth (refresh token, vb.)

### Orders/Posts Testleri İçin
→ **JSONPlaceholder** kullanın
- Posts endpoint'ini orders olarak simüle edin
- Nested resources (comments) test edin
- CRUD işlemleri için ideal

### Error Handling Testleri İçin
→ **Hepsi** kullanılabilir
- Her API farklı hata kodları döndürebilir
- Çeşitli senaryoları test edin

---

## 🔧 API Yapılandırması

Framework'te API yapılandırması `cypress/support/dummy-api-config.js` dosyasında bulunur:

```javascript
import { DUMMY_APIS, getEndpointUrl } from './dummy-api-config';

// API base URL'i al
const baseUrl = DUMMY_APIS.DUMMY_JSON.baseUrl;

// Endpoint URL'i oluştur
const url = getEndpointUrl('DUMMY_JSON', 'products', { id: 1 });
// Sonuç: https://dummyjson.com/products/1
```

---

## ⚠️ Önemli Notlar

1. **Rate Limiting**: Dummy API'ler rate limiting uygulayabilir. Çok fazla istek göndermeyin.

2. **Data Persistence**: Dummy API'lerde yaptığınız değişiklikler kalıcı değildir. Her istekte yeni data dönebilir.

3. **Response Format**: Her API'nin response formatı farklıdır. Test dosyalarını inceleyerek formatları öğrenebilirsiniz.

4. **Internet Bağlantısı**: Dummy API'ler online olmalıdır. İnternet bağlantınızı kontrol edin.

5. **API Availability**: Dummy API'ler bazen yavaş olabilir veya geçici olarak erişilemez olabilir.

---

## 🚀 Hızlı Test

Tüm API'lerin çalıştığını test etmek için:

```bash
# Tüm testleri çalıştır
npm test

# Sadece auth testleri
npm run test:auth

# Sadece products testleri
npm run test:products

# Sadece orders testleri
npm run test:orders
```

---

## 📖 Daha Fazla Bilgi

- [DummyJSON Docs](https://dummyjson.com/docs)
- [ReqRes Docs](https://reqres.in/)
- [JSONPlaceholder Docs](https://jsonplaceholder.typicode.com/)

---

**İyi testler! 🎉**

