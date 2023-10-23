# @asaje/fetch

A lightweight fetch wrapper with useful features like abort controller, applying middleware functions to request or response interceptor

## Installation

```sh
npm install @asaje/fetch
```

or

```sh
yarn add @asaje/fetch
```

or

```sh
pnpm add @asaje/fetch
```

## How it works

### Create a new Fetch instance with general config

```ts
import { Fetch } from '@asaje/fetch';

export const api = new Fetch({
  baseURL: 'https://jsonplaceholder.typicode.com',
});

export async function getTodo(id: number) {
  const response = await api.get(`todos/${id}`);
  console.log(response);
}
```

### Set request headers

It's possible to set headers by just calling the **setHeaders** method.

```ts
api.setHeaders({
  Authorization: 'Bearer 123',
  'Content-Type': 'application/json',
});
```

### Applying a middleware

A middleware is a function called just before the request is sent. The request config is inject as the middleware parameter

```ts
import { FetchRequest } from '@asaje/fetch';

api.addMiddleware((request: FetchRequest) => {
  // Do what you want with the request

  console.log(request);
  return request; // Important to return the request
});
```

##### Clear middlewares

```ts
api.clearMiddlewares();
```

### Intercept response

A response interceptor is a function called when the request is done and is applied to the response

```ts
import { FetchResponse } from '@asaje/fetch';

api.addInterceptor((response: FetchResponse) => {
  // Do what you want with the response
  console.log(response);

  return response;
});
```

##### Clear interceptors

```ts
api.clearInterceptors();
```

### Bypass ngrok security

```ts
api.bypassNgrokSecurity();
```
