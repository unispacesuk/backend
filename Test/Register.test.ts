import { data } from './Data/data';
import { Config } from '../App/Config';
import { PoolClient, Pool } from 'pg';

describe('RegisterController a user', () => {
  const user = data.user;
  let pgPool: Pool;
  let client: PoolClient;
  const config = new Config();

  beforeAll(async () => {
    pgPool = new Pool({
      connectionString: config.dbUrl,
    });
    client = await pgPool.connect();
    await client.query('BEGIN');
  });

  afterAll(async () => {
    await client.query('ROLLBACK');
  });

  it('Can create user.', async () => {
    try {
      const { rows } =
        await client.query(`INSERT INTO users (username, email, not_username, first_name, last_name)
                                         VALUES ('${user.username}', '${user.email}',
                                                 '${user.not_username}', '${user.first_name}', '${user.last_name}')
                                         RETURNING *`);
      expect(rows.length).toBeGreaterThan(0);
    } catch (e) {
      throw e;
    }
  });

  it('Can retrieve user by username.', async () => {
    try {
      const { rows } = await client.query(`SELECT *
                                         FROM users
                                         WHERE username = '${user.username}'
                                           AND not_username = '${user.not_username}'`);
      expect(rows.length).toBe(1);
    } catch (e) {
      throw e;
    }
  });

  it('Can retrieve user by email.', async () => {
    try {
      const { rows } = await client.query(`SELECT *
                                         FROM users
                                         WHERE email = '${user.email}'
                                           AND not_username = '${user.not_username}'`);
      expect(rows.length).toBe(1);
    } catch (e) {
      throw e;
    }
  });
});
