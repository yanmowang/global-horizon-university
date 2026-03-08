const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const certificateRoutes = require('../server/routes/certificateRoutes');
const Certificate = require('../server/models/Certificate');

// Mock certificate data
const validCertificate = {
  certificateId: 'GHU-2023-1234',
  name: 'John Doe',
  program: 'MBA',
  date: '2023-06-15',
};

let mongoServer;
let app;

// Setup the test environment
beforeAll(async () => {
  // Create a MongoDB Memory Server
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  // Connect to the in-memory database
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Create Express app for testing
  app = express();
  app.use(express.json());
  app.use('/api/certificates', certificateRoutes);
});

// Cleanup after tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Clear the database between tests
beforeEach(async () => {
  await Certificate.deleteMany({});
});

describe('Certificate Verification API', () => {
  // Test for valid certificate
  test('should verify a valid certificate', async () => {
    // Insert a test certificate to the database
    await Certificate.create(validCertificate);

    // Make the verification request
    const response = await request(app).get(
      `/api/certificates/verify/${validCertificate.certificateId}`
    );

    // Assertions
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('Valid');
    expect(response.body.data).toHaveProperty('name', validCertificate.name);
    expect(response.body.data).toHaveProperty('program', validCertificate.program);
    expect(response.body.data).toHaveProperty('date', validCertificate.date);
  });

  // Test for invalid certificate
  test('should return Invalid for non-existent certificate', async () => {
    // Make the verification request for a non-existent certificate
    const response = await request(app).get('/api/certificates/verify/GHU-2023-9999');

    // Assertions
    expect(response.statusCode).toBe(404);
    expect(response.body.status).toBe('Invalid');
    expect(response.body.message).toBe('Certificate not found in our database');
  });

  // Test for malformed certificate ID
  test('should handle malformed certificate ID', async () => {
    // Make the verification request with a malformed ID
    const response = await request(app).get('/api/certificates/verify/invalid-format');

    // Even with a malformed ID, the API should just return "Invalid"
    expect(response.statusCode).toBe(404);
    expect(response.body.status).toBe('Invalid');
  });

  // Test certificate generation and verification flow
  test('should create and then verify a certificate', async () => {
    // Create a new certificate
    const newCertificate = {
      name: 'Jane Smith',
      program: 'BSc',
      date: '2023-07-20',
    };

    // Generate the certificate
    const createResponse = await request(app).post('/api/certificates').send(newCertificate);

    // Check if certificate was created successfully
    expect(createResponse.statusCode).toBe(201);
    expect(createResponse.body.success).toBe(true);
    expect(createResponse.body.data).toHaveProperty('certificateId');

    const certificateId = createResponse.body.data.certificateId;

    // Now verify the newly created certificate
    const verifyResponse = await request(app).get(`/api/certificates/verify/${certificateId}`);

    // Assertions
    expect(verifyResponse.statusCode).toBe(200);
    expect(verifyResponse.body.status).toBe('Valid');
    expect(verifyResponse.body.data).toHaveProperty('name', newCertificate.name);
    expect(verifyResponse.body.data).toHaveProperty('program', newCertificate.program);
    expect(verifyResponse.body.data).toHaveProperty('date', newCertificate.date);
  });
});
