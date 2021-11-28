import * as config from '../App/Config';
import {Client} from "pg";

/**
 * Config tests the whole Config folder
 *  - tests the db connection
 *  - tests the configs file
 */
describe('My config', () => {
  let configs: config.Config;

  beforeAll(() => {
    configs = new config.Config();
  });

  test('Configs are initiated and valid', () => {
    expect(configs).toBeTruthy();
    expect(configs.port).not.toBe(undefined);
    expect(configs.dbUrl).not.toBe('' || undefined);
  });

  test('Connection is initiated and valid', async () => {
    expect(config.Connection).toBeTruthy();
    await expect(config.Connection.tryConnection()).resolves.toBeTruthy();
    expect(config.Connection.Client).toBeInstanceOf(Client);
  });

});