/*
 Unispaces database setup.

 Patterns:
    - Auto Increment Sequence: TABLE_COLUMN_AI
    - Id Column: _id
    - Hash or password columns must be not_column_name
        (user logs in with username then password column must be not_username)
    -
 */

-- users table
CREATE SEQUENCE USERS_ID_AI;
CREATE TABLE users (
    _id SMALLINT NOT NULL DEFAULT NEXTVAL('USERS_ID_AI'),
    username VARCHAR (100) NOT NULL UNIQUE,
    --first_name varchar (100) NOT NULL,
    --last_name varchar (100) NOT NULL,
    email varchar (100) NOT NULL UNIQUE,
    not_username varchar (255) NOT NULL, -- password
    PRIMARY KEY (_id)
);
ALTER SEQUENCE USERS_ID_AI OWNED BY users._id;
-- INSERT INTO users (username, email, not_username) VALUES ('admin', 'admin@email.com', 'admin');

-- roles table
CREATE SEQUENCE ROLES_ID_AI;
CREATE TABLE roles (
    _id SMALLINT NOT NULL DEFAULT NEXTVAL('ROLES_ID_AI'),
    name varchar (100) NOT NULL UNIQUE,
    PRIMARY KEY (_id)
);
ALTER SEQUENCE ROLES_ID_AI OWNED BY roles._id;

-- user roles table (joint table users <-> roles)
CREATE TABLE user_roles (
    user_id SMALLINT NOT NULL REFERENCES users (_id),
    role_id SMALLINT NOT NULL REFERENCES roles (_id),
    PRIMARY KEY (user_id, role_id)
);

-- questions table
CREATE TABLE questions (
    _id UUID NOT NULL UNIQUE,
    user_id SMALLINT REFERENCES users (_id),
    title VARCHAR (255) NOT NULL,
    content TEXT NOT NULL,
    answers JSONB DEFAULT '{}',
    PRIMARY KEY (_id)
);
-- INSERT INTO questions (_id, user_id, title, content) VALUES (gen_random_uuid(), 1, 'The first question', 'This will be the question content here. Text should allow for long texts....')
-- UPDATE questions SET answers = '{"1":"first answer"}' WHERE _id='ff3cc520-47c6-4048-901b-05a9b11ca760';

-- boards table
