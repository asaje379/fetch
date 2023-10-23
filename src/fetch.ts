import {
  FetchMiddleware,
  FetchConfig,
  FetchInterceptor,
  HttpMethod,
  ResponseConfig,
  RequestConfig,
  FetchResponse,
} from './typings';
import { formatURL, isSuccessHttpCode } from './utils';

const oldFetch = window.fetch;

const writeMethods = [HttpMethod.POST, HttpMethod.PUT, HttpMethod.PATCH];

export class Fetch {
  middlewares: FetchMiddleware[] = [];
  interceptors: FetchInterceptor[] = [];
  baseURL = '';

  constructor(config?: FetchConfig) {
    this.baseURL = config?.baseURL ?? '';
  }

  private async applyMiddlewares(
    request: RequestInit,
    middlewares: FetchMiddleware[] = this.middlewares,
  ): Promise<RequestInit> {
    if (middlewares.length === 0) return request;

    const currentRequest = await middlewares[0](request);

    return await this.applyMiddlewares(currentRequest, middlewares.slice(1));
  }

  private async applyInterceptors(
    response: FetchResponse,
    interceptors: FetchInterceptor[] = this.interceptors,
  ): Promise<FetchResponse> {
    if (interceptors.length === 0) return response;

    const currentResponse = await interceptors[0](response);
    return await this.applyInterceptors(currentResponse, interceptors.slice(1));
  }

  async request<T extends BodyInit>(config: RequestConfig<T>) {
    const controller = new AbortController();

    let res: Response | undefined = undefined;
    try {
      const formattedURL = formatURL(this.baseURL, config.url);

      const request = {
        method: config.method,
        ...(writeMethods.includes(config.method) ? { body: config.body } : {}),
        ...(config.headers ? { headers: config.headers } : {}),
      };

      // Applying middlewares
      const requestObject = await this.applyMiddlewares(request);

      res = await oldFetch(formattedURL, {
        ...requestObject,
        signal: controller.signal,
      });

      const data = await res[
        config.responseConfig ? config.responseConfig.responseType : 'json'
      ]();

      // Applying interceptors
      const isSuccessResponse = isSuccessHttpCode(res.status);
      const response = await this.applyInterceptors({
        data,
        isSuccess: isSuccessResponse,
      });
      if (isSuccessResponse)
        return { ...response, abort: controller.abort, response: res };
      throw { ...response, status: res.status, response: res };
    } catch (error: any) {
      const _res = await this.applyInterceptors({
        response: res,
        isSuccess: false,
      });
      throw { ..._res, isAborted: error.name === 'AbortError' };
    }
  }

  addMiddleware(middleware: FetchMiddleware) {
    this.middlewares.push(middleware);
  }

  addInterceptor(interceptor: FetchInterceptor) {
    this.interceptors.push(interceptor);
  }

  clearMiddlewares() {
    this.middlewares = [];
  }

  clearInterceptors() {
    this.interceptors = [];
  }

  setHeaders(headers: Record<string, string>) {
    this.middlewares.push((request) => {
      return {
        ...request,
        headers: { ...(request.headers ?? {}), ...headers },
      };
    });
  }

  bypassNgrokSecurity() {
    this.middlewares.push((request) => {
      return {
        ...request,
        headers: {
          ...(request.headers ?? {}),
          'ngrok-skip-browser-warning': 'any',
        },
      };
    });
  }

  async get(url: string, headers?: Headers, responseConfig?: ResponseConfig) {
    return await this.request({
      method: HttpMethod.GET,
      url,
      headers,
      responseConfig,
    });
  }

  async post<T extends BodyInit>(
    url: string,
    body?: T,
    headers?: Headers,
    responseConfig?: ResponseConfig,
  ) {
    return await this.request({
      method: HttpMethod.POST,
      url,
      headers,
      responseConfig,
      body,
    });
  }

  async put<T extends BodyInit>(
    url: string,
    body?: T,
    headers?: Headers,
    responseConfig?: ResponseConfig,
  ) {
    return await this.request({
      method: HttpMethod.PUT,
      url,
      headers,
      responseConfig,
      body,
    });
  }

  async patch<T extends BodyInit>(
    url: string,
    body?: T,
    headers?: Headers,
    responseConfig?: ResponseConfig,
  ) {
    return await this.request({
      method: HttpMethod.PATCH,
      url,
      headers,
      responseConfig,
      body,
    });
  }

  async delete(
    url: string,
    headers?: Headers,
    responseConfig?: ResponseConfig,
  ) {
    return await this.request({
      method: HttpMethod.GET,
      url,
      headers,
      responseConfig,
    });
  }
}

export const api = new Fetch();
