import { Connection } from '../../Config';
import { request } from '../../Core/Routing';

const addEvent = async (type: string) => {
  const userId = request().data('userId');
  return new Promise<void>((resolve, reject) => {
    Connection.client.query('INSERT INTO events (user_id, type) VALUES ($1, $2)', [userId, type],
      (error) => {
      if (error) return reject(error);
      resolve();
      });
  });
};

export { addEvent };
