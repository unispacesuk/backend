import * as express from 'express';
import {Config, Connection} from "./Config";

import {Api} from "./Api";

const config = new Config();
const db = new Connection();

const App: express.Express = express();

App.use(express.json());
App.use(new Api().router);

App.listen(config.port, async () => {
  await db.connection.then(() => {
    console.log('|==================================|');
    console.log('|                                  |');
    console.log(`|  Server is running on port ${config.port}  |`);
    console.log('| Database is also up and running. |');
    console.log('|                                  |');
    console.log('|==================================|');
  });
});

App.post('/u', async (req, res) => {
  const {username, email, not_username} = req.body;

  await db.client.query(`INSERT INTO users (username, email, not_username)
                         VALUES ($1, $2, $3)`,
    [username, email, not_username], (error) => {
      if (error)
        return console.log(error);
    });

  res.status(200).send({message: 'HI'});
});

/**
 * Questions test
 */
App.post('/q', async (req, res) => {
  const {user_id, title, content} = req.body;
  await db.client.query(`INSERT INTO questions (_id, user_id, title, content)
                         VALUES (gen_random_uuid(), $1, $2, $3)`,
    [user_id, title, content], (error) => {
      if (error)
        return console.log(error);
    });

  res.status(200).send({message: 'question added'});
});

App.get('/q/:id', async (req, res) => {
  const {id} = req.params;
  const question = await getQuestion(id);
  res.status(200).send(question);
});

function getQuestion(id: string) {
  return new Promise((resolve, reject) => {
    db.client.query(`SELECT *
                     FROM questions
                     WHERE _id = $1`,
      [id], (error, result) => {
        if (error)
          return reject(error);
        resolve(result.rows[0]);
      });
  });
}