const pool = require('../utils/pool');

module.exports = class Post {
  id;
  userId;
  githubUserId;
  content;

  constructor(row) {
    this.id = row.id;
    this.userId = row.user_id;
    this.githubUserId = row.github_user_id;
    this.content = row.content;
  }

  static async getAll() {
    const { rows } = await pool.query('SELECT * FROM posts');

    return rows.map((row) => new Post(row));
  }

  static async insert({ userId, githubUserId, content }) {
    const { rows } = await pool.query(
      `
    INSERT INTO posts (user_id, github_user_id, content)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
      [userId, githubUserId, content]
    );
    return new Post(rows[0]);
  }
};
