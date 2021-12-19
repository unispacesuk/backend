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

### Decorators

```javascript
@middleware()
// This decorator registers a function as a middleware
// It will run the next() function automatically, we just write the logic
```