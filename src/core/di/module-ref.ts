import { Constructor } from './container';
import { ModuleContext } from './module-context';

export class ModuleRef {
  private rootModule: ModuleContext;

  constructor(rootModuleCls: Constructor<any>) {
    this.rootModule = new ModuleContext(rootModuleCls);
  }

  getRootModule() {
    return this.rootModule;
  }

  initialize() {
    this.insert(this.rootModule);
  }

  private insert(module: ModuleContext) {
    const importedModules =
      Reflect.getMetadata('imports', module.getModuleCls()) || [];

    const providers =
      Reflect.getMetadata('providers', module.getModuleCls()) || [];
    module.setProviders(providers);

    const childModules: ModuleContext[] = importedModules.map(
      (module: Constructor<any>) => new ModuleContext(module)
    );

    if (childModules?.length > 0) {
      module.setChildren(childModules);
      childModules.forEach((childModule) => {
        this.insert(childModule);
      });
    }
  }
}
