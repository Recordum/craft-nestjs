import { ArrayEntry } from './../../../node_modules/type-fest/source/entry.d';
import 'reflect-metadata';

export type Constructor<T> = new (...args: any[]) => T;
export type Token = string;
export class Container {
  private providers = new Map<Token, Constructor<any>>();
  private instances = new Map<Token, any>();

  setProvider<T>(token: Token, value: Constructor<T>): void {
    this.providers.set(token, value);
  }

  getProviders(): Constructor<any>[] {
    const keys = Array.from(this.providers.keys());
    return keys?.map((key) => this.getProvider(key));
  }

  getProvider<T>(token: Token): Constructor<T> {
    const provider = this.providers.get(token);
    if (!provider) {
      throw new Error(`No provider for ${token}`);
    }
    return provider;

    // const dependencies =
    //   Reflect.getMetadata('design:paramtypes', provider) || [];

    // const args = dependencies.map((dependency: any) =>
    //   this.resolveDependencies(dependency)
    // );

    // const instance = new provider(...args) as T;
    // return instance;
  }

  private resolveDependencies<T>(dependency: Constructor<any>): T {
    const token = dependency.name;
    const instance = this.getProvider(token) as T;
    return instance;
  }
}
