export interface FetchConfig {
  baseURL: string;
}

export interface RequestConfig<T> {
  method: HttpMethod;
  url: string;
  body?: T;
  headers?: Headers | Record<string, string>;
  responseConfig?: ResponseConfig;
}

export interface FetchRequest extends RequestInit {}
export type FetchResponse = {
  data?: any;
  isSuccess: boolean;
  response?: Response;
};

export type FetchMiddleware = (
  request: FetchRequest,
) => FetchRequest | Promise<FetchRequest>;

export type FetchInterceptor = (
  response: FetchResponse,
) => FetchResponse | Promise<FetchResponse>;

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}

export type ResponseConfig = {
  responseType: ResponseType;
};
export type ResponseType = 'text' | 'json' | 'blob';
