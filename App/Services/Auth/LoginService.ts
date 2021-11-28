import {client} from "../../Config";

interface User {
  username: string,
  not_username: string
}

function findUser(data: User) {
  const {username, not_username} = data;
  return new Promise((resolve, reject) => {
    client.query('select * from users where username=$1 and not_username=$2',
      [username, not_username],(error, result) => {
      if (error) reject(error);
      resolve(result.rows);
    });
  });
}

export {
  findUser
};