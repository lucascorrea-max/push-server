export type HttpMethod = 'get' | 'post' | 'head' | 'put' | 'delete' | 'connect' | 'options' | 'trace' | 'patch';

export interface Http {
    route(method: HttpMethod, url: string, callback: Function): void;
}
