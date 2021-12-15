import {AuthenticationService as auth} from "../App/Services/Auth/AuthenticationService";
import {data} from './Data/data';

describe('Token authentication test.', () => {

  const user = data.user;
  const username = user.username;
  let token: string;

  beforeAll(() => {
    expect(auth).toBeTruthy();
  });

  it('Can generate token.', () => {
    token = auth.generateToken({username: username});
    expect(token).toBeDefined();
  });

  it('Contains username when decoded', async   () => {
    // @ts-ignore
    const {username} = await auth.verifyToken(token);
    expect(username).toMatch(user.username);
  });

});