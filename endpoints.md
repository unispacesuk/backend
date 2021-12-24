## API Endpoints

Collection of API endpoints for logging and testing purposes.

***

## AuthenticationController

#### LoginController

```http
  POST /auth/login
```

```javascript
  //example response
```
***
#### RegisterController

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
/**
 * These are two global methods that will allow us to access the
 * Request and Response interfaces from express. These also include all
 * methods present in those interfaces and they allow us to abstract
 * requests and responses and make the code more beautiful.
 */
```
***
```typescript
@middleware()
/**
 * This decorator registers a function as a middleware.
 * It will run the next() function automatically, we just write the logic.
 * A middleware can also be registered in a separate class
 * and called as a function when building the route.
 */
```
***
```typescript
@route()
/**
 * We can use this decorator to register a route. At the moment we just use it
 * to register a "controller" route and allows us to not have to repeat
 * request and response parameters on the "controller" methods.
 */

interface IResponse {
  code: number;
  body: object;
}
```