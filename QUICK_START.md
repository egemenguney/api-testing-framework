# 🚀 Quick Start Guide

Hızlı başlangıç için adım adım rehber.

## ⚡ 5 Dakikada Başlayın

### 1. Kurulum (1 dk)

```bash
npm install
```

### 2. Environment Ayarları (Opsiyonel - 1 dk)

```bash
# Dummy API'ler için .env dosyası GEREKMEZ!
# Framework varsayılan olarak DummyJSON kullanır

# Eğer kendi API'nizi kullanmak isterseniz:
cp .env.example .env
# API_BASE_URL ve diğer değerleri güncelle
```

**Not**: Bu framework dummy API'ler kullanır, bu yüzden `.env` dosyası oluşturmanıza gerek yok!

### 3. İlk Testi Çalıştır (1 dk)

```bash
# Cypress UI'ı aç
npm run cy:open

# Veya headless mode
npm test
```

### 4. Test Sonuçlarını Gör (1 dk)

```bash
# Rapor oluştur
npm run test:report

# Rapor dosyası: cypress/reports/mochawesome.html
```

## 📝 İlk Testinizi Yazın

`cypress/e2e/my-first-test.spec.js` dosyası oluşturun:

```javascript
describe('My First API Test (DummyJSON)', () => {
  it('should get all products', () => {
    cy.apiRequest('GET', 'https://dummyjson.com/products').then((response) => {
      cy.assertApiResponse(response, 200);
      expect(response.body.products).to.be.an('array');
      expect(response.body.total).to.be.greaterThan(0);
    });
  });

  it('should get a single product', () => {
    cy.apiRequest('GET', 'https://dummyjson.com/products/1').then((response) => {
      cy.assertApiResponse(response, 200);
      expect(response.body.id).to.eq(1);
      expect(response.body).to.have.property('title');
      expect(response.body).to.have.property('price');
    });
  });
});
```

## 🎯 Yaygın Kullanım Senaryoları

### Sadece Auth Testlerini Çalıştır

```bash
npm run test:auth
```

### Chrome'da Çalıştır

```bash
npm run test:chrome
```

### Rapor ile Çalıştır

```bash
npm run test:report
```

## 🔧 Custom Command Kullanımı

### DummyJSON ile API İsteği

```javascript
// Products listesi
cy.apiRequest('GET', 'https://dummyjson.com/products').then((response) => {
  cy.assertApiResponse(response, 200);
});

// ReqRes ile Login
cy.apiRequest('POST', 'https://reqres.in/api/login', {
  body: {
    email: 'eve.holt@reqres.in',
    password: 'cityslicka'
  }
}).then((response) => {
  expect(response.body.token).to.be.a('string');
});
```

### Response Doğrula

```javascript
cy.apiRequest('GET', 'https://dummyjson.com/products/1').then((response) => {
  cy.assertApiResponse(response, 200, {
    id: 'number',
    title: 'string',
    price: 'number'
  });
});
```

### Pagination ile İstek

```javascript
cy.apiRequest('GET', 'https://dummyjson.com/products', {
  qs: { limit: 5, skip: 10 }
}).then((response) => {
  expect(response.body.products.length).to.be.at.most(5);
});
```

## 📚 Sonraki Adımlar

1. ✅ [README.md](README.md) - Detaylı dokümantasyon
2. ✅ [Test Örnekleri](cypress/e2e/) - Mevcut test dosyalarını incele
3. ✅ [Custom Commands](cypress/support/commands.js) - Helper fonksiyonları öğren
4. ✅ [Fixtures](cypress/fixtures/) - Test data yönetimi

## ❓ Sorun mu Yaşıyorsunuz?

- **Testler çalışmıyor?** → İnternet bağlantınızı kontrol edin (dummy API'ler online olmalı)
- **Rapor oluşmuyor?** → `npm run clean:reports` sonra tekrar deneyin
- **Bağımlılık hatası?** → `rm -rf node_modules && npm install`
- **API hatası?** → Dummy API'ler bazen yavaş olabilir, tekrar deneyin

## 🌐 Kullanılan Dummy API'ler

- **DummyJSON**: https://dummyjson.com (Products, Auth, Carts)
- **ReqRes**: https://reqres.in (Auth, Users)
- **JSONPlaceholder**: https://jsonplaceholder.typicode.com (Posts, Comments)

---

**İyi testler! 🎉**

