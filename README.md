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
