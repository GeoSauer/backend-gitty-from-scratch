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

INSERT INTO
  users (email, password_hash, first_name, last_name)
VALUES
  (
    'alvin@example.com',
    'notarealpasswordhash',
    'Alvin',
    'A'
  );

CREATE TABLE github_users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  login VARCHAR NOT NULL,
  email VARCHAR,
  avatar VARCHAR
);

INSERT INTO github_users (login, email, avatar)
VALUES
(
'phonyUser',
'fake@phony.com',
'https://www.heyguyshesaphony.com/jpg/420/69'
      );

CREATE TABLE posts (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
content VARCHAR(255),
user_id BIGINT,
github_user_id BIGINT,
FOREIGN KEY (user_id) REFERENCES users(id),
FOREIGN KEY (github_user_id) REFERENCES github_users(id)
);

INSERT INTO posts (user_id, github_user_id, content)
VALUES
(1, null, 'Wow here I go again sharing stuff'),
(1, null, 'Why did I share all that stuff'),
(null, 1, 'I will not be sharing anything at all');