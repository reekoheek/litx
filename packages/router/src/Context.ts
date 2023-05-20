import { RouterError } from './RouterError.js';

export class Context {
  readonly path: string;
  readonly query: Record<string, string> = {};
  readonly params: Record<string, string> = {};
  private readonly state: Record<string, unknown> = {};

  constructor(path: string) {
    const url = new URL(path, 'http://localhost');
    url.searchParams.forEach((v, k) => (this.query[k] = v));

    this.path = url.pathname;
  }

  equals(ctx: Context): boolean {
    if (this.path !== ctx.path) {
      return false;
    }
    const keySet = new Set([...Object.keys(this.query), ...Object.keys(ctx.query)]);
    for (const key of keySet) {
      if (this.query[key] !== ctx.query[key]) {
        return false;
      }
    }
    return true;
  }

  get<T>(key: string): T | undefined {
    return this.state[key] as T;
  }

  set(key: string, value: unknown) {
    if (value === undefined || value === null) {
      throw new RouterError('cannot set state to empty, do you mean to remove state?');
    }
    this.state[key] = value;
  }

  remove(key: string) {
    delete this.state[key];
  }
}
