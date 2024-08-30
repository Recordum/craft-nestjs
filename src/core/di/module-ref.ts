import { Constructor } from './container';
import { ModuleContext } from './module-context';
import { ChildProvider1 } from './module-ref.spec';

export class ModuleRef {
  private rootModule: ModuleContext;
  private refModulesName: string[] = [];

  constructor(rootModuleCls: Constructor<any>) {
    this.rootModule = new ModuleContext(rootModuleCls);
  }

  traverse(callback: (moduleContext: ModuleContext) => void) {
    this.visit(this.rootModule, callback);
  }

  getRootModule() {
    return this.rootModule;
  }

  initialize() {
    this.insert(this.rootModule, []);
  }

  private insert(module: ModuleContext, path: string[]) {
    const importedModules =
      Reflect.getMetadata('imports', module.getModuleCls()) || [];

    const providers =
      Reflect.getMetadata('providers', module.getModuleCls()) || [];
    module.setProviders(providers);

    //TODO 비효율 줄이기
    const circularModuleName = importedModules
      .map((module: Constructor<any>) => module.name)
      .find((name: string) => path.includes(name));
    if (circularModuleName) {
      throw new Error(
        `Circular dependency detected: ${module.getName()} '->' ${circularModuleName}`
      );
    }

    const newPath = [...path, module.getName()];
    const childModules: ModuleContext[] = importedModules.map(
      (module: Constructor<any>) => new ModuleContext(module)
    );

    if (childModules?.length > 0) {
      module.setChildren(childModules);
      childModules.forEach((childModule) => {
        this.insert(childModule, newPath);
      });
    }
  }

  private visit(
    child: ModuleContext,
    callback: (moduleContext: ModuleContext) => void
  ) {
    if (!child) {
      throw new Error('not exist node');
    }
    callback(child);
    const children = child.getChildren();
    if (children?.length > 0) {
      children.forEach((child) => this.visit(child, callback));
    }
  }
}
