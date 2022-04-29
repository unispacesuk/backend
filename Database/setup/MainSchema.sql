/*
 Unispaces database setup.

 Patterns:
    - Auto Increment Sequence: TABLE_COLUMN_AI
    - Id Column: _id
    - Hash or password columns must be not_column_name
        (user logs in with username then password column must be not_username)

 Access:
    - Tables that have an access column can set who can view certain content
    - 'all', 'admin', 'course-name' (course name would be replaced by the course of whoever is trying to access)

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
    avatar VARCHAR (255),
    is_online BOOLEAN DEFAULT false,
    privacy_settings JSONB NOT NULL DEFAULT '{}',
    notification_settings JSONB NOT NULL DEFAULT '{}',
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
    user_id SMALLINT NOT NULL REFERENCES users (_id) ON DELETE CASCADE,
    role_id SMALLINT NOT NULL REFERENCES roles (_id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- questions table
CREATE SEQUENCE QUESTIONS_ID_AI;
CREATE TABLE questions (
    _id INTEGER NOT NULL DEFAULT NEXTVAL('QUESTIONS_ID_AI'),
    user_id INTEGER NOT NULL REFERENCES users (_id) ON DELETE CASCADE,
    title VARCHAR (255) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    last_updated TIMESTAMP NULL,
    tags TEXT[] NULL,
    last_replied TIMESTAMP NULL,
    active BOOLEAN DEFAULT true,
    votes INTEGER DEFAULT 0,
    PRIMARY KEY (_id)
);
ALTER SEQUENCE QUESTIONS_ID_AI OWNED BY questions._id;

-- question votes
CREATE TABLE questions_votes (
    question_id INTEGER NOT NULL REFERENCES questions (_id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users (_id) ON DELETE CASCADE,
    type VARCHAR (10) NOT NULL,
    created_at TIMESTAMP DEFAULT now()
);

-- answers table
CREATE SEQUENCE ANSWERS_ID_AI;
CREATE TABLE answers (
    _id INTEGER NOT NULL DEFAULT NEXTVAL('ANSWERS_ID_AI'),
    user_id INTEGER NOT NULL REFERENCES users (_id) ON DELETE CASCADE,
    question_id INTEGER REFERENCES questions (_id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    last_updated TIMESTAMP NULL,
    best BOOLEAN DEFAULT false,
    PRIMARY KEY (_id)
);
ALTER SEQUENCE ANSWERS_ID_AI OWNED BY answers._id;
-- INSERT INTO questions (_id, user_id, title, content) VALUES (gen_random_uuid(), 1, 'The first question', 'This will be the question content here. Text should allow for long texts....')

-- categories
CREATE SEQUENCE BOARD_CATEGORIES_ID_AI;
CREATE TABLE board_categories (
    _id INTEGER NOT NULL DEFAULT NEXTVAL('BOARD_CATEGORIES_ID_AI'),
    user_id INTEGER NOT NULL REFERENCES users (_id) ON DELETE CASCADE,
    title VARCHAR (255) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    last_updated TIMESTAMP NULL,
    PRIMARY KEY (_id)
);
ALTER SEQUENCE BOARD_CATEGORIES_ID_AI OWNED BY board_categories._id;

-- boards
CREATE SEQUENCE BOARD_BOARDS_ID_AI;
CREATE TABLE board_boards (
    _id INTEGER NOT NULL DEFAULT NEXTVAL('BOARD_BOARDS_ID_AI'),
    user_id INTEGER NOT NULL REFERENCES users (_id) ON DELETE CASCADE,
    board_category_id INTEGER NOT NULL REFERENCES board_categories (_id) ON DELETE CASCADE,
    title VARCHAR (255) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    last_updated TIMESTAMP NULL,
    access VARCHAR (10) DEFAULT 'all',
    PRIMARY KEY (_id)
);
ALTER SEQUENCE BOARD_BOARDS_ID_AI OWNED BY board_boards._id;

-- threads
CREATE SEQUENCE BOARD_THREADS_ID_AI;
CREATE TABLE board_threads (
    _id INTEGER NOT NULL DEFAULT NEXTVAL('BOARD_THREADS_ID_AI'),
    user_id INTEGER NOT NULL REFERENCES users (_id) ON DELETE CASCADE,
    board_boards_id INTEGER NOT NULL REFERENCES board_boards (_id) ON DELETE CASCADE,
    title VARCHAR (255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    last_updated TIMESTAMP NULL,
    PRIMARY KEY (_id)
);
ALTER SEQUENCE BOARD_THREADS_ID_AI OWNED BY board_threads._id;

-- thread stars
-- for when users stars a thread that they want to come back to
-- no need for pk only two fk user_id and thread_id
CREATE TABLE board_threads_stars (
    user_id INTEGER NOT NULL REFERENCES users (_id) ON DELETE CASCADE,
    thread_id INTEGER NOT NULL REFERENCES board_threads (_id) ON DELETE CASCADE
);

-- thread replies
CREATE SEQUENCE BOARD_THREAD_REPLIES_ID_AI;
CREATE TABLE board_thread_replies (
    _id INTEGER NOT NULL DEFAULT NEXTVAL('BOARD_THREAD_REPLIES_ID_AI'),
    user_id INTEGER NOT NULL REFERENCES users (_id) ON DELETE CASCADE,
    board_thread_id INTEGER NOT NULL REFERENCES board_threads (_id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    last_updated TIMESTAMP NULL,
    PRIMARY KEY (_id)
);
ALTER SEQUENCE BOARD_THREAD_REPLIES_ID_AI OWNED BY board_thread_replies._id;

-- blog posts
CREATE SEQUENCE BLOG_POSTS_ID_AI;
CREATE TABLE blog_posts (
    _id INTEGER NOT NULL DEFAULT NEXTVAL('BLOG_POSTS_ID_AI'),
    user_id INTEGER NOT NULL REFERENCES users (_id) ON DELETE CASCADE,
    title VARCHAR (255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    last_updated TIMESTAMP NULL,
--     clicks INTEGER NULL,
    PRIMARY KEY (_id)
    -- views ?
);
ALTER SEQUENCE BLOG_POSTS_ID_AI OWNED BY blog_posts._id;

-- blog post comments
CREATE SEQUENCE BLOG_COMMENTS_ID_AI;
CREATE TABLE blog_comments (
    _id INTEGER NOT NULL DEFAULT NEXTVAL('BLOG_COMMENTS_ID_AI'),
    user_id INTEGER NOT NULL REFERENCES users (_id) ON DELETE CASCADE,
    blog_post INTEGER NOT NULL REFERENCES blog_posts (_id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    PRIMARY KEY (_id)
);
ALTER SEQUENCE BLOG_COMMENTS_ID_AI OWNED BY blog_comments._id;

-- blog vote types
CREATE SEQUENCE BLOG_VOTE_TYPES_ID_AI;
CREATE TABLE blog_vote_types (
    _id INTEGER NOT NULL DEFAULT NEXTVAL('BLOG_VOTE_TYPES_ID_AI'),
    vote_type VARCHAR (100) NOT NULL,
    PRIMARY KEY (_id)
);
ALTER SEQUENCE BLOG_VOTE_TYPES_ID_AI OWNED BY blog_vote_types._id;
INSERT INTO blog_vote_types (vote_type) VALUES ('thumbs_up');
INSERT INTO blog_vote_types (vote_type) VALUES ('thumbs_down');
INSERT INTO blog_vote_types (vote_type) VALUES ('big_smile');
INSERT INTO blog_vote_types (vote_type) VALUES ('heart_eyes');
INSERT INTO blog_vote_types (vote_type) VALUES ('rofl');
INSERT INTO blog_vote_types (vote_type) VALUES ('surprised');

-- blog votes / reactions
CREATE TABLE blog_votes (
    blog_id INTEGER NOT NULL REFERENCES blog_posts (_id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users (_id) ON DELETE CASCADE,
    vote_type INTEGER NOT NULL REFERENCES blog_vote_types (_id) ON DELETE CASCADE
);

-- chat-rooms
-- CREATE SEQUENCE CHAT_ROOMS_ID_AI;
    -- default of a room will be public and then allow for private
    -- private rooms would have users[] as the allowed people to view it
    -- can be all or admin... admin makes it be an admin only room
    -- blocked[] will hold blocked users... if a userid is present on this array the backend should respond with 'you are blocked'
CREATE TABLE chat_rooms (
    _id UUID NOT NULL DEFAULT gen_random_uuid(), -- the id we want a uuid... will be better for usage
    title VARCHAR (255) NOT NULL,
    user_id INTEGER REFERENCES users (_id),
    users INTEGER[],
    blocked INTEGER[],
    created_at TIMESTAMP DEFAULT now(),
    last_updated TIMESTAMP NULL,
    status VARCHAR (15) DEFAULT 'public',
    permission VARCHAR (15) DEFAULT 'all',
    PRIMARY KEY (_id)
);
INSERT INTO chat_rooms (title) VALUES ('General');
INSERT INTO chat_rooms (title) VALUES ('General');
INSERT INTO chat_rooms (title) VALUES ('Computing');
INSERT INTO chat_rooms (title) VALUES ('Arts and Designs');
INSERT INTO chat_rooms (title) VALUES ('Social Sciences');
INSERT INTO chat_rooms (title, permission) VALUES ('The Admin Rooms', 'admin');

-- chat_messages
CREATE SEQUENCE CHAT_ROOM_MESSAGES_ID_AI;
CREATE TABLE chat_room_messages (
    _id INTEGER NOT NULL DEFAULT NEXTVAL('CHAT_ROOM_MESSAGES_ID_AI'),
    chat_room UUID NOT NULL REFERENCES chat_rooms (_id),
    content TEXT NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users (_id),
    created_at TIMESTAMP DEFAULT now(),
    last_updated TIMESTAMP NULL,
    PRIMARY KEY (_id)
);
ALTER SEQUENCE CHAT_ROOM_MESSAGES_ID_AI OWNED BY chat_room_messages._id;

-- events table
CREATE SEQUENCE EVENTS_ID_AI;
CREATE TABLE events (
    _id INTEGER NOT NULL DEFAULT NEXTVAL('EVENTS_ID_AI'),
    user_id INTEGER NOT NULL REFERENCES users (_id) ON DELETE CASCADE,
    type VARCHAR (100) NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    PRIMARY KEY (_id)
);
ALTER SEQUENCE EVENTS_ID_AI OWNED BY events._id;
