# backend

Backend for Unispaces.

---

### Patterns and Infos

- Branches should be using the same "id" as the issue in Linear.app

---

## Decorators and More

#### Request and Response

```typescript
import { request, response } from './App/Core/Routing'
import { Controller, Post } from './App/Core/Decorators'
import { IResponse } from "./App/Interfaces";

@Controller('/example')
export class Example {
  @Post('/post')
  async postExample(): Promise<IResponse> {
    const body = request().body;
    const headers = request().headers;
    // some logic here
    return {
      code: 200,
      body: {
        m: 'post example'
      }
    }
  }
  
  @Get('/get')
  getExample() {
    // some logic here
    return response().status(200).send({
      m: 'get example'
    });
  }
}

/**
 * request() and response() are two global methods that will allow us to
 *  access the Request and Response interfaces from express. These also
 *  include all methods present in those interfaces and they allow us to
 *  abstract requests and responses and make the code more beautiful.
 * A response can be sent in two ways, returning the response() method itself
 *  or returning an object of IResponse.
 */

interface IResponse {
  code: number;
  body: object;
}
```

---

#### @Middleware()
```typescript
import { Middleware, Next } from "./App/Core/Decorators";

class Example {
  @Middleware()
  static middleware() {
    // some logic here
    Next();
  }
}

/**
 * This decorator registers a function as a middleware.
 * When registering a function as a middleware we cannot forget to call Next()
 *  after our logic is complete.
 */
```

---

#### @Controller()
```typescript
import { Controller } from "./App/Core/Decorators";

@Controller('/user')
export class User {
  // controller routes and logic
}

/**
 * This decorator will register a controller route (express.use('/user', routes)).
 * Before registering the controller route the app will grab all the routes set inside
 *  the controller, register them using the Router() method from express and assign
 *  respectively. See below for more.
 */
```

---

#### Method routes

```typescript
import { Controller, Get, Post, Put, Patch, Delete } from "./App/Core/Decorators";

@Controller('/example')
export class Example {
  @Get('/get')
  getExample() {
    // some logic here
  }
  
  @Post('/post')
  postExample() {
    // some logic here
  }
  
  @Put('/put')
  putExample() {
    // some logic here
  }
  
  @Patch('/patch')
  patchExample() {
    // some logic here
  }
  
  @Delete('/delete')
  deleteExample() {
    // some logic here
  }
}

/**
 * We have Http Method decorators available to register method routes that refer to
 *  the controller that they are registered in.
 * We just set the decorator with the path before the function and the code will do the rest.
 */
```
Now we think, what if we want to set a middleware to always run when making a
request to a certain route? <br>
Say we define a middleware `authenticate()` because we want only logged-in users to access our app.
```typescript
import { Controller, Get, Middleware, Next } from "./App/Core/Decorators";

// define a service or a class for the middlewares
class AuthService {
  @Middleware()
  static authenticate() {
    // some logic here
    Next();
  }
}

@Controller('/example')
export class Example {
  /**
   * Middlewares are static functions (for now) and are called as an array of middlewares
   *  just after the path. We can chain as many middlewares as we want.
   */
  @Get('/get', [AuthService.authenticate])
  getExample() {
    // some logic here
  }
}
```