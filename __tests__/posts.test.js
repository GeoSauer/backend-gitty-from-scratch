const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService.js');

const mockUser = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  password: '12345',
};

const mockPost = {
  content: 'up to 255 characters',
};

const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? mockUser.password;

  // Create an "agent" that gives us the ability
  // to store cookies between requests in a test
  const agent = request.agent(app);

  // Create a user to sign in with
  const user = await UserService.create({ ...mockUser, ...userProps });

  // ...then sign in
  const { email } = user;
  await agent.post('/api/v1/users/sessions').send({ email, password });
  return [agent, user];
};

describe('post routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  afterAll(() => {
    pool.end();
  });

  test('POST /api/v1/posts should allow authenticated users to create a new post', async () => {
    const [agent] = await registerAndLogin();
    const resp = await agent.post('/api/v1/posts').send(mockPost);
    expect(resp.status).toBe(200);
    expect(resp.body).toMatchInlineSnapshot(`
      Object {
        "content": "up to 255 characters",
        "githubUserId": null,
        "id": "1",
        "userId": "1",
      }
    `);
  });

  test('POST /api/v1/posts should allow authenticated github_users to create a new post', async () => {});
  test('GET /api/v1/posts should allow authenticated users to return a list of posts for all users', async () => {});
});
