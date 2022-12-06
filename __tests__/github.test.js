const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

jest.mock('../lib/services/github');

describe('github auth', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  test('GET /api/v1/github/login should redirect to github oauth page', async () => {
    const resp = await request(app).get('/api/v1/github/login');
    expect(resp.header.location).toMatch(
      'https://github.com/login/oauth/authorize?client_id=Iv1.04f6a185a27b5e96&scope=user&redirect_uri=http://localhost:7890/api/v1/github/callback'
      //   /https:\/\/github.com\/login\/oauth\/authorize\?client_id=[\w\d]+&scope=user&redirect_uri=http:\/\/localhost:7890\/api\/v1\/github\/callback/i
    );
  });

  test('GET /api/v1/github/callback should login users and redirect them to the dashboard', async () => {
    const resp = await request
      .agent(app)
      .get('/api/v1/github/callback?code=42')
      .redirects(1);
    expect(resp.body).toEqual({
      id: expect.any(String),
      login: 'phonyUser',
      email: 'fake@phony.com',
      avatar: 'https://www.heyguyshesaphony.com/jpg/420/69',
      iat: expect.any(Number),
      exp: expect.any(Number),
    });
  });
  test('DELETE /api/v1/github should sign user out', async () => {});
});
