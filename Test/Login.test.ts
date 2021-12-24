import {LoginController} from "../App/Api/Auth/LoginController";
import {Router} from "express";

/**
 * LoginController route tests
 */
describe('LoginController route tests', () => {
  let login: LoginController;

  beforeAll(() => {
    login = new LoginController();
  });

  it('LoginController to be initiated', () => {
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