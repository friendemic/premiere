import Hash from "./Hash";
import axios, { AxiosInstance } from "axios";
import { trailUrl } from "./helpers/UrlHelper";

export type HttpInterceptor = (client: AxiosInstance) => void;

export class Api {
  private _base: string;

  headers: Hash<string> = {};

  interceptors: HttpInterceptor[] = [];

  get path(): string {
    return "";
  }

  constructor(properties: Hash<any> = {}) {
    Object.assign(this, properties);
  }

  get base(): string {
    return this._base || api._base || "/";
  }

  set base(value: string) {
    this._base = value;
  }

  get mixedHeaders(): Hash<string> {
    return Object.assign({}, api.headers, this.headers);
  }

  get baseUrl(): string {
    return this.base + (this.path.length ? "/" : "") + this.path;
  }

  get jwtToken(): string | null {
    return this.mixedHeaders.Authorization;
  }

  set jwtToken(token: string) {
    this.headers.Authorization = `Bearer ${token}`;
  }

  get csrfToken(): string {
    return this.mixedHeaders["X-CSRF-Token"];
  }

  set csrfToken(token: string | null) {
    this.headers["X-CSRF-Token"] = token;
  }

  get mixedInterceptors(): HttpInterceptor[] {
    return api.interceptors.concat(this.interceptors);
  }

  get http(): AxiosInstance {
    const client = axios.create({ baseURL: this.baseUrl, headers: this.mixedHeaders });
    // apply interceptors
    this.mixedInterceptors.forEach(fn => fn(client));

    // return client
    return client;
  }
}

const api = new Api();
export default api;
