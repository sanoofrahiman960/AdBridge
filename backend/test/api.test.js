const fs = require('fs/promises');
const path = require('path');
const { after, beforeEach, test } = require('node:test');
const assert = require('node:assert/strict');

const testDbPath = path.join(__dirname, 'tmp-db.json');

process.env.DATA_FILE = testDbPath;
process.env.JWT_SECRET = 'test-secret';

const request = require('supertest');
const app = require('../src/app');
const db = require('../src/store');

beforeEach(async () => {
  await db.reset();
});

after(async () => {
  try {
    await fs.unlink(testDbPath);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
});

test('health endpoint responds successfully', async () => {
  const response = await request(app).get('/api/health');

  assert.equal(response.status, 200);
  assert.equal(response.body.status, 'ok');
});

test('demo advertiser can log in and create a campaign', async () => {
  const loginResponse = await request(app).post('/api/auth/login').send({
    email: 'brand@adbridge.demo',
    password: 'password123',
  });

  assert.equal(loginResponse.status, 200);
  assert.ok(loginResponse.body.token);

  const createCampaignResponse = await request(app)
    .post('/api/campaigns')
    .set('Authorization', `Bearer ${loginResponse.body.token}`)
    .send({
      title: 'Q3 Founder Stories',
      brandName: 'Nimbus Labs',
      description: 'Short-form creator campaign for startup founders.',
      budgetMin: 700,
      budgetMax: 1800,
      platforms: ['Instagram'],
    });

  assert.equal(createCampaignResponse.status, 201);
  assert.equal(createCampaignResponse.body.campaign.title, 'Q3 Founder Stories');
});

test('demo creator can apply to a new campaign', async () => {
  const advertiserLogin = await request(app).post('/api/auth/login').send({
    email: 'brand@adbridge.demo',
    password: 'password123',
  });

  const campaignResponse = await request(app)
    .post('/api/campaigns')
    .set('Authorization', `Bearer ${advertiserLogin.body.token}`)
    .send({
      title: 'Fresh Campaign',
      brandName: 'Nimbus Labs',
      description: 'New creator slot.',
      platforms: ['YouTube'],
    });

  const creatorLogin = await request(app).post('/api/auth/login').send({
    email: 'creator@adbridge.demo',
    password: 'password123',
  });

  const applicationResponse = await request(app)
    .post(`/api/applications/campaigns/${campaignResponse.body.campaign.id}`)
    .set('Authorization', `Bearer ${creatorLogin.body.token}`)
    .send({
      pitch: 'I can produce a conversion-focused explainer.',
      proposedFee: 800,
      timelineDays: 5,
    });

  assert.equal(applicationResponse.status, 201);
  assert.equal(applicationResponse.body.application.status, 'pending');
});
