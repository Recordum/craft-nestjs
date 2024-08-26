export type Constructor<T> = new (...args: any[]) => T;
export type Token = string;
export class Container {
  private providers = new Map<Token, Constructor<any>>();
  private instances = new Map<Token, any>();

  set<T>(token: Token, value: Constructor<T>): void {
    this.providers.set(token, value);
  }

  get<T>(token: Token): T | null {
    const existingInstance = this.instances.get(token);
    if (existingInstance) {
      return existingInstance;
    }

    const provider = this.providers.get(token);
    if (!provider) {
      throw new Error(`No provider for ${token}`);
    }

    return new provider();
  }
}
