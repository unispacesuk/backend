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
    _id INTEGER NOT NULL DEFAULT NEXTVAL('USERS_ID_AI'),
    username VARCHAR (100) NOT NULL UNIQUE,
    first_name VARCHAR (100) NOT NULL,
    last_name VARCHAR (100) NOT NULL,
    email VARCHAR (100) NOT NULL UNIQUE,
    not_username varchar (255) NOT NULL, -- password
    created_at TIMESTAMP DEFAULT now(),
    last_login TIMESTAMP NULL,
    last_updated TIMESTAMP NULL, -- maybe make it now()? because we just created the account and means last edit was now?
    PRIMARY KEY (_id)
);
ALTER SEQUENCE USERS_ID_AI OWNED BY users._id;
-- INSERT INTO users (username, email, not_username) VALUES ('admin', 'admin@email.com', 'admin');

-- roles table
-- user / mod / admin -- start with these roles. admin can do all and mods will have some less permissions
CREATE SEQUENCE ROLES_ID_AI;
CREATE TABLE roles (
    _id INTEGER NOT NULL DEFAULT NEXTVAL('ROLES_ID_AI'),
    name varchar (100) NOT NULL UNIQUE,
    PRIMARY KEY (_id)
);
ALTER SEQUENCE ROLES_ID_AI OWNED BY roles._id;
INSERT INTO roles (name) VALUES ('Administrator');
INSERT INTO roles (name) VALUES ('Moderator');
INSERT INTO roles (name) VALUES ('Default');

-- user roles table (joint table users <-> roles)
CREATE TABLE user_roles (
    user_id SMALLINT NOT NULL REFERENCES users (_id),
    role_id SMALLINT NOT NULL REFERENCES roles (_id),
    PRIMARY KEY (user_id, role_id)
);

-- questions table
CREATE SEQUENCE QUESTIONS_ID_AI;
CREATE TABLE questions (
    -- _id UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    _id INTEGER NOT NULL DEFAULT NEXTVAL('QUESTIONS_ID_AI'),
    user_id INTEGER REFERENCES users (_id),
    title VARCHAR (255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    last_updated TIMESTAMP NULL,
    -- last_replied on
    PRIMARY KEY (_id)
);
ALTER SEQUENCE QUESTIONS_ID_AI OWNED BY questions._id;

-- answers table
CREATE SEQUENCE ANSWERS_ID_AI;
CREATE TABLE answers (
    -- _id UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    _id INTEGER NOT NULL DEFAULT NEXTVAL('ANSWERS_ID_AI'),
    user_id INTEGER REFERENCES users (_id),
    question_id INTEGER REFERENCES questions (_id),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    -- last_updated TIMESTAMP NULL,
    PRIMARY KEY (_id)
);
ALTER SEQUENCE ANSWERS_ID_AI OWNED BY answers._id;
-- INSERT INTO questions (_id, user_id, title, content) VALUES (gen_random_uuid(), 1, 'The first question', 'This will be the question content here. Text should allow for long texts....')
-- UPDATE questions SET answers = '{"1":"first answer"}' WHERE _id='ff3cc520-47c6-4048-901b-05a9b11ca760';

-- boards table
