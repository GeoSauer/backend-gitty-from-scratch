const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService.js');
jest.mock('../lib/services/github');

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

  test('GET /api/v1/posts should allow authenticated users to return a list of posts for all users', async () => {
    const [agent] = await registerAndLogin();
    const resp = await agent.get('/api/v1/posts').expect(200);
    expect(resp.body).toMatchInlineSnapshot(`
      Array [
        Object {
          "content": "Wow here I go again sharing stuff",
          "githubUserId": null,
          "id": "1",
          "userId": "1",
        },
        Object {
          "content": "Why did I share all that stuff",
          "githubUserId": null,
          "id": "2",
          "userId": "1",
        },
        Object {
          "content": "I will not be sharing anything at all",
          "githubUserId": "1",
          "id": "3",
          "userId": null,
        },
      ]
    `);
    await request(app).get('/api/v1/posts').expect(401);
  });

  test('GET /api/v1/posts should allow authenticated github_users to return a list of posts for all users', async () => {
    const agent = request.agent(app);
    await agent.get('/api/v1/github/callback?code=42').redirects(1);
    const resp = await agent.get('/api/v1/posts');
    expect(resp.body).toMatchInlineSnapshot(`
      Array [
        Object {
          "content": "Wow here I go again sharing stuff",
          "githubUserId": null,
          "id": "1",
          "userId": "1",
        },
        Object {
          "content": "Why did I share all that stuff",
          "githubUserId": null,
          "id": "2",
          "userId": "1",
        },
        Object {
          "content": "I will not be sharing anything at all",
          "githubUserId": "1",
          "id": "3",
          "userId": null,
        },
      ]
    `);
    await request(app).get('/api/v1/posts').expect(401);
  });

  // test('POST /api/v1/posts should allow authenticated users to create a new post', async () => {
  //   const [agent] = await registerAndLogin();
  //   const resp = await agent.post('/api/v1/posts').send(mockPost).expect(200);
  //   expect(resp.body).toMatchInlineSnapshot(`
  //     Object {
  //       "content": "up to 255 characters",
  //       "githubUserId": null,
  //       "id": "4",
  //       "userId": "2",
  //     }
  //   `);
  //   await request(app).post('/api/v1/posts').expect(401);
  // });

  test('POST /api/v1/posts should allow authenticated github_users to create a new post', async () => {
    const agent = request.agent(app);
    await agent.get('/api/v1/github/callback?code=42').redirects(1);
    const resp = await agent.post('/api/v1/posts').send(mockPost).expect(200);
    expect(resp.body).toMatchInlineSnapshot(`
      Object {
        "content": "up to 255 characters",
        "githubUserId": "1",
        "id": "4",
        "userId": null,
      }
    `);
    await request(app).post('/api/v1/posts').expect(401);
  });
});
