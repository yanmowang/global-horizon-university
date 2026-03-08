const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Certificate = require('../../server/models/Certificate');
const User = require('../../server/models/User');

let mongoServer;
let testUser;

// Setup in-memory MongoDB server
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Create test user
  testUser = await User.create({
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
  });
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

describe('Certificate Model', () => {
  test('should create a certificate with valid data', async () => {
    const certificateData = {
      userId: testUser._id,
      certificateType: 'bachelor',
      program: 'Computer Science',
      metadata: {
        graduationDate: new Date('2023-05-15'),
        gpa: 3.8,
        honors: 'Cum Laude',
      },
    };

    const certificate = await Certificate.create(certificateData);

    // Check that certificate was created
    expect(certificate).toBeDefined();
    expect(certificate._id).toBeDefined();
    expect(certificate.certificateNumber).toBeDefined();
    expect(certificate.verificationLink).toBeDefined();
    expect(certificate.program).toBe('Computer Science');
    expect(certificate.certificateType).toBe('bachelor');
    expect(certificate.status).toBe('pending');

    // Check that certificateNumber follows expected format
    expect(certificate.certificateNumber).toMatch(/^GHU-BA-\d{4}-\d{6}$/);

    // Check metadata
    expect(certificate.metadata.gpa).toBe(3.8);
    expect(certificate.metadata.honors).toBe('Cum Laude');
  });

  test('should not create a certificate with invalid certificateType', async () => {
    const certificateData = {
      userId: testUser._id,
      certificateType: 'invalid',
      program: 'Computer Science',
    };

    await expect(Certificate.create(certificateData)).rejects.toThrow();
  });

  test('should not create a certificate without required fields', async () => {
    const certificateData = {
      certificateType: 'bachelor',
      // Missing userId and program
    };

    await expect(Certificate.create(certificateData)).rejects.toThrow();
  });

  test('should generate a unique certificate number', async () => {
    const certificateData1 = {
      userId: testUser._id,
      certificateType: 'bachelor',
      program: 'Computer Science',
    };

    const certificateData2 = {
      userId: testUser._id,
      certificateType: 'bachelor',
      program: 'Data Science',
    };

    const cert1 = await Certificate.create(certificateData1);
    const cert2 = await Certificate.create(certificateData2);

    expect(cert1.certificateNumber).not.toBe(cert2.certificateNumber);
  });

  test('should set default expiry date', async () => {
    const certificateData = {
      userId: testUser._id,
      certificateType: 'bachelor',
      program: 'Computer Science',
    };

    const certificate = await Certificate.create(certificateData);

    // Check that expiry date is set and is later than issue date
    expect(certificate.expiryDate).toBeInstanceOf(Date);
    expect(certificate.expiryDate.getTime()).toBeGreaterThan(certificate.issueDate.getTime());

    // Should be approximately 5 years later
    const fiveYearsInMs = 5 * 365 * 24 * 60 * 60 * 1000;
    const expectedExpiryTimestamp = certificate.issueDate.getTime() + fiveYearsInMs;

    // Allow for small differences in calculation
    expect(Math.abs(certificate.expiryDate.getTime() - expectedExpiryTimestamp)).toBeLessThan(
      24 * 60 * 60 * 1000
    );
  });
});
