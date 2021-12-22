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
***
#### Register

```http
  POST /auth/register
```

```javascript
  //example response
```
***
## Questions
#### Post new question

```http
  POST /question/post
```

```javascript
  //example response
```
***
#### Get one question

```http
  GET /question/get/:id
```

```javascript
  //example response
```
***
#### Get all questions

```http
  POST /question/get/all
```

```javascript
  //example response
```
***
#### Get a users questions

```http
  POST /question/get/user/:id
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
***
```typescript
@middleware()
// This decorator registers a function as a middleware
// It will run the next() function automatically, we just write the logic
// A middleware can also be registered in a separate class and called as a function when building the route
```
***
```typescript
@route()
// Use this decorator to register something as a route
// It will not "generate" a route but make use of a response sender.
// All we do on the controller method is return the body response

interface IResponse {
  code: number;
  body: object;
}
```