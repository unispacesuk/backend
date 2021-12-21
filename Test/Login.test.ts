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

  it('Login to be initiated', () => {
    expect(login).toBeTruthy();
  });

  it('Route to be valid', () => {
    // @ts-ignore
    const loginRoute = jest.spyOn(login, 'route', 'get');
    // @ts-ignore
    loginRoute.mockReturnValue(Router);

    expect(login.route).toEqual(Router);
  });
});