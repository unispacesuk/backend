import { data } from './Data/data';
import { Config } from '../App/Config';
import { PoolClient, Pool } from 'pg';

describe('Post a question.', () => {
  const question = data.question;
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

  it('Can post a new question.', async () => {
    try {
      const { rows } = await client.query(
        'INSERT INTO questions (user_id, title, content) ' +
        `VALUES ('${question.user_id}', '${question.title}', '${question.content}') RETURNING *`);
    } catch (e) {
      throw e;
    }
  });
});
