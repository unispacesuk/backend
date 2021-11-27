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
    --username VARCHAR (100) NOT NULL UNIQUE,
    --first_name varchar (100) NOT NULL,
    --last_name varchar (100) NOT NULL,
    email varchar (100) NOT NULL UNIQUE,
    not_username varchar (255) NOT NULL, -- password
    PRIMARY KEY (_id)
);
ALTER SEQUENCE USERS_ID_AI OWNED BY users._id;

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