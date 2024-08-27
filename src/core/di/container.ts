import 'reflect-metadata';

export type Constructor<T> = new (...args: any[]) => T;
export type Token = string;
export class Container {
  private providers = new Map<Token, Constructor<any>>();
  private instances = new Map<Token, any>();

  set<T>(token: Token, value: Constructor<T>): void {
    this.providers.set(token, value);
  }

  get<T>(token: Token): T {
    const existingInstance = this.instances.get(token);
    if (existingInstance) {
      return existingInstance;
    }

    const provider = this.providers.get(token);
    if (!provider) {
      throw new Error(`No provider for ${token}`);
    }

    const dependencies =
      Reflect.getMetadata('design:paramtypes', provider) || [];

    const args = dependencies.map((dependency: any) =>
      this.resolveDependencies(dependency)
    );

    const instance = new provider(...args) as T;
    return instance;
  }

  private resolveDependencies<T>(dependency: Constructor<any>): T {
    const token = dependency.name;
    const instance = this.get(token) as T;
    return instance;
  }
}


