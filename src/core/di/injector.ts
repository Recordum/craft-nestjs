import { ModuleRef } from './module-ref';

export class Injector {
  constructor(private moduleRef: ModuleRef) {
    this.moduleRef = moduleRef;
  }

  inject() {}

  findInstance(token: string) {
    this.moduleRef.traverse((moduleContext) => {
      const instance = moduleContext.getInstance(token);
      if (instance) {
        return instance;
      }
    });
  }
}
