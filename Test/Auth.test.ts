describe('Validate user authentication route', () => {
  let auth;

  beforeAll(() => {
    auth = new Authentication();
  });

  test('Authentication class to be initiated', () => {
    expect(auth).toBeTruthy();
  });

  test('Route to exist and be defined', () => {
    expect(auth.authRoute).toBeDefined();
  });

  test.todo('test route and return');

});