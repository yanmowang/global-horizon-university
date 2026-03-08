const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');
const app = require('../../server/app');
const User = require('../../server/models/User');
const Certificate = require('../../server/models/Certificate');

let mongoServer;
let testUser;
let adminUser;
let userToken;
let adminToken;

// Setup in-memory MongoDB server
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Create test users
  testUser = await User.create({
    name: 'Test User',
    email: 'user@example.com',
    password: 'password123',
    role: 'user',
  });

  adminUser = await User.create({
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
  });

  // Generate tokens
  userToken = jwt.sign(
    { id: testUser._id, role: testUser.role },
    process.env.JWT_SECRET || 'testsecret',
    { expiresIn: '1h' }
  );

  adminToken = jwt.sign(
    { id: adminUser._id, role: adminUser.role },
    process.env.JWT_SECRET || 'testsecret',
    { expiresIn: '1h' }
  );
});

// Clean up after tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Clear certificate collection between tests
beforeEach(async () => {
  await Certificate.deleteMany({});
});

describe('Certificate API Routes', () => {
  describe('POST /api/certificates/request', () => {
    it('should create a certificate request for authenticated user', async () => {
      const res = await request(app)
        .post('/api/certificates/request')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          certificateType: 'bachelor',
          program: 'Computer Science',
          metadata: {
            graduationDate: '2023-05-15',
            gpa: 3.8,
            honors: 'Cum Laude',
          },
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('certificateNumber');
      expect(res.body.data).toHaveProperty('status', 'pending');
      expect(res.body.data).toHaveProperty('program', 'Computer Science');
      expect(res.body.data).toHaveProperty('certificateType', 'bachelor');
    });

    it('should return 401 for unauthenticated requests', async () => {
      const res = await request(app).post('/api/certificates/request').send({
        certificateType: 'bachelor',
        program: 'Computer Science',
      });

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('success', false);
    });

    it('should return 400 for invalid certificate type', async () => {
      const res = await request(app)
        .post('/api/certificates/request')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          certificateType: 'invalid',
          program: 'Computer Science',
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('success', false);
    });
  });

  describe('GET /api/certificates/user', () => {
    beforeEach(async () => {
      // Create test certificates for the user
      await Certificate.create({
        userId: testUser._id,
        certificateType: 'bachelor',
        program: 'Computer Science',
        certificateNumber: 'GHU-BA-2023-123456',
        status: 'issued',
      });

      await Certificate.create({
        userId: testUser._id,
        certificateType: 'master',
        program: 'Data Science',
        certificateNumber: 'GHU-MA-2023-654321',
        status: 'pending',
      });
    });

    it('should return all certificates for the authenticated user', async () => {
      const res = await request(app)
        .get('/api/certificates/user')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveLength(2);
      expect(res.body.data[0]).toHaveProperty('program');
      expect(res.body.data[0]).toHaveProperty('certificateNumber');
    });

    it('should return 401 for unauthenticated requests', async () => {
      const res = await request(app).get('/api/certificates/user');

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('success', false);
    });
  });

  describe('GET /api/certificates/verify/:number', () => {
    beforeEach(async () => {
      // Create a verified certificate
      await Certificate.create({
        userId: testUser._id,
        certificateType: 'bachelor',
        program: 'Computer Science',
        certificateNumber: 'GHU-BA-2023-123456',
        status: 'issued',
      });
    });

    it('should verify a valid certificate number', async () => {
      const res = await request(app).get('/api/certificates/verify/GHU-BA-2023-123456');

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('valid', true);
      expect(res.body.data).toHaveProperty('certificateNumber', 'GHU-BA-2023-123456');
      expect(res.body.data).toHaveProperty('status', 'issued');
    });

    it('should return invalid for non-existent certificate number', async () => {
      const res = await request(app).get('/api/certificates/verify/INVALID-CERT-NUMBER');

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('valid', false);
    });
  });
});
