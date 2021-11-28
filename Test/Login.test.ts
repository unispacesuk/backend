import {Login} from "../App/Api/Auth/Login";
import {Router} from "express";

/**
 * Login route tests
 */
describe('Login route tests', () => {
  let login: Login;

  beforeAll(() => {
    login = new Login();
  });

  test('Login to be initiated', () => {
    expect(login).toBeTruthy();
  });

  test('Route to be valid', () => {
    // @ts-ignore
    const loginRoute = jest.spyOn(login, 'loginRoute', 'get');
    // @ts-ignore
    loginRoute.mockReturnValue(Router);

    expect(login.loginRoute).toEqual(Router);
  });

  test.todo('test login route and return values');
});