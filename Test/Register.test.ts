// @ts-ignore
import user from './Data/user.json';
import {Connection} from "../App/Config";
import {Client} from "pg";

describe('Register a user', () => {

  let client: Client;

  beforeAll(() => {
    client = Connection.client;
  });

  test('client connection', () => {
    expect(client).toBeInstanceOf(Client);
  });

  test.todo('can create user', () => {

  });

  test.todo('can retrieve user', () => {

  });
});