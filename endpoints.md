## API Endpoints

Collection of API endpoints for logging and testing purposes.

***

## Authentication

#### Login

```http
  POST /auth/login
```

```javascript
  //example response
```

#### Register

```http
  POST /auth/register
```

```javascript
  //example response
```

***

### Decorators and More
```typescript
request()
response()
// these two functions allow us to use request and response without having to repeat everytime on the function call

doLogin(req: Request, res: Response)
// becomes
doLogin()
```

```typescript
@middleware()
// This decorator registers a function as a global middleware
// It will run the next() function automatically, we just write the logic
// A middleware can also be registered in a separate class and called as a function when building the route
```