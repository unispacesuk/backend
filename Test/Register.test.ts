// @ts-ignore
import user from './Data/user.json';
import {Config} from "../App/Config";
import {PoolClient, Pool} from "pg";

describe('Register a user', () => {

  const mock = user.user;
  let pgPool: Pool;
  let client: PoolClient;
  const config = new Config();

  beforeAll(async () => {
    pgPool = new Pool({
      connectionString: config.dbUrl
    });
    client = await pgPool.connect();
    await client.query('BEGIN');
  });

  afterAll(async () => {
    await client.query('ROLLBACK');
  });

  it('Can create user.', async () => {
    try {
      const {rows} = await client.query(`INSERT INTO users (username, email, not_username)
                                         VALUES ('${mock.username}', '${mock.email}',
                                                 '${mock.not_username}')
                                         RETURNING *`);
      expect(rows.length).toBeGreaterThan(0);
    } catch (e) {
      throw e;
    }
  });

  it('Can retrieve user by username.', async () => {
    try {
      const {rows} = await client.query(`SELECT *
                                         FROM users
                                         WHERE username = '${mock.username}'
                                           AND not_username = '${mock.not_username}'`);
      expect(rows.length).toBe(1);
    } catch (e) {
      throw e;
    }
  });

  it('Can retrieve user by email.', async () => {
    try {
      const {rows} = await client.query(`SELECT *
                                         FROM users
                                         WHERE email = '${mock.email}'
                                           AND not_username = '${mock.not_username}'`);
      expect(rows.length).toBe(1);
    } catch (e) {
      throw e;
    }
  });
});