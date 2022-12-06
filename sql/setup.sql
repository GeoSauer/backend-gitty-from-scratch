-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
DROP TABLE IF EXISTS users CASCADE;

DROP TABLE IF EXISTS github_users CASCADE;

DROP TABLE IF EXISTS posts;

CREATE TABLE users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email VARCHAR,
  password_hash VARCHAR NOT NULL,
  first_name VARCHAR NOT NULL,
  last_name VARCHAR NOT NULL
);

CREATE TABLE github_users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  login VARCHAR NOT NULL,
  email VARCHAR,
  avatar VARCHAR
);

CREATE TABLE posts (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
content VARCHAR(255),
user_id BIGINT,
github_user_id BIGINT,
FOREIGN KEY (user_id) REFERENCES users(id),
FOREIGN KEY (github_user_id) REFERENCES github_users(id)
);