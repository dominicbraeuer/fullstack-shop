import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import cookieParser from 'cookie-parser';

describe('E2E Tests', () => {
  let app: INestApplication<App>;
  let accessToken: string;
  let customerId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('AppController', () => {
    it('/ (GET)', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect('Hello World!');
    });
  });

  describe('Authentication Flow', () => {
    const testUser = {
      name: 'E2E Test User',
      email: `e2e-${Date.now()}@test.com`,
      password: 'testpass123',
    };

    it('should create a new customer', () => {
      return request(app.getHttpServer())
        .post('/customers')
        .send(testUser)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('name', testUser.name);
          expect(res.body).toHaveProperty('email', testUser.email);
          expect(res.body).not.toHaveProperty('password');
          customerId = (res.body as { id: number }).id;
        });
    });

    it('should login with correct credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: testUser.email, password: testUser.password })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('customerId', customerId);
          expect(res.headers['set-cookie']).toBeDefined();
          const cookie = res.headers['set-cookie'][0];
          expect(cookie).toContain('access_token=');
          // Extract token from cookie for later use
          const tokenMatch = cookie.match(/access_token=([^;]+)/);
          if (tokenMatch) {
            accessToken = tokenMatch[1];
          }
        });
    });

    it('should fail login with wrong credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: testUser.email, password: 'wrongpassword' })
        .expect(401);
    });
  });

  describe('Protected Routes', () => {
    it('should deny access without token', () => {
      return request(app.getHttpServer()).get('/customers').expect(401);
    });

    it('should allow access with valid cookie', () => {
      return request(app.getHttpServer())
        .get('/customers')
        .set('Cookie', [`access_token=${accessToken}`])
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect((res.body as any[])[0]).toHaveProperty('id', customerId);
          expect((res.body as any[])[0]).not.toHaveProperty('password');
        });
    });

    it('should allow access with Bearer token', () => {
      return request(app.getHttpServer())
        .get('/customers')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });

    it('should get specific customer', () => {
      return request(app.getHttpServer())
        .get(`/customers/${customerId}`)
        .set('Cookie', [`access_token=${accessToken}`])
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', customerId);
          expect(res.body).not.toHaveProperty('password');
        });
    });

    it('should deny access to other customer', () => {
      return request(app.getHttpServer())
        .get(`/customers/999999`)
        .set('Cookie', [`access_token=${accessToken}`])
        .expect(403);
    });
  });

  describe('Products', () => {
    let productId: number;

    it('should get all products without auth', () => {
      return request(app.getHttpServer())
        .get('/products')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('should create a product with auth', () => {
      return request(app.getHttpServer())
        .post('/products')
        .set('Cookie', [`access_token=${accessToken}`])
        .send({
          name: 'E2E Test Product',
          description: 'Test product description',
          price: 99.99,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('name', 'E2E Test Product');
          expect(res.body).toHaveProperty('price', 99.99);
          productId = (res.body as { id: number }).id;
        });
    });

    it('should deny creating product without auth', () => {
      return request(app.getHttpServer())
        .post('/products')
        .send({ name: 'Unauthorized Product', price: 50 })
        .expect(401);
    });

    it('should update a product', () => {
      return request(app.getHttpServer())
        .put(`/products/${productId}`)
        .set('Cookie', [`access_token=${accessToken}`])
        .send({ name: 'Updated Product', price: 149.99 })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('name', 'Updated Product');
          expect(res.body).toHaveProperty('price', 149.99);
        });
    });

    it('should delete a product', () => {
      return request(app.getHttpServer())
        .delete(`/products/${productId}`)
        .set('Cookie', [`access_token=${accessToken}`])
        .expect(204);
    });
  });

  describe('Orders', () => {
    let orderId: number;
    let productId: number;

    beforeAll(async () => {
      // Create a product for the order
      const response = await request(app.getHttpServer())
        .post('/products')
        .set('Cookie', [`access_token=${accessToken}`])
        .send({
          name: 'Order Test Product',
          description: 'Product for order testing',
          price: 25.0,
        });
      productId = (response.body as { id: number }).id;
    });

    it('should create an order', () => {
      return request(app.getHttpServer())
        .post('/orders')
        .set('Cookie', [`access_token=${accessToken}`])
        .send({
          productIds: [productId],
          totalPrice: 25.0,
          customerId,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('customerId', customerId);
          expect(res.body).toHaveProperty('productIds');
          expect((res.body as { productIds: number[] }).productIds).toContain(
            productId,
          );
          orderId = (res.body as { id: number }).id;
        });
    });

    it('should get all orders for logged in customer', () => {
      return request(app.getHttpServer())
        .get('/orders')
        .set('Cookie', [`access_token=${accessToken}`])
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect((res.body as any[]).length).toBeGreaterThan(0);
          expect((res.body as any[])[0]).toHaveProperty(
            'customerId',
            customerId,
          );
        });
    });

    it('should get specific order', () => {
      return request(app.getHttpServer())
        .get(`/orders/${orderId}`)
        .set('Cookie', [`access_token=${accessToken}`])
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', orderId);
          expect(res.body).toHaveProperty('customerId', customerId);
        });
    });

    it('should delete an order', () => {
      return request(app.getHttpServer())
        .delete(`/orders/${orderId}`)
        .set('Cookie', [`access_token=${accessToken}`])
        .expect(204);
    });

    it('should deny access to orders without auth', () => {
      return request(app.getHttpServer()).get('/orders').expect(401);
    });
  });

  describe('Logout', () => {
    it('should logout successfully', () => {
      return request(app.getHttpServer())
        .post('/auth/logout')
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('message', 'Logged out successfully');
          const cookie = res.headers['set-cookie']?.[0];
          if (cookie) {
            expect(cookie).toContain('access_token=;');
          }
        });
    });
  });
});
