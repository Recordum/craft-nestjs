import { Constructor, Container } from '.';

export class ModuleContext {
  private name: string;
  private moduleCls: Constructor<any>;
  private children: ModuleContext[] = [];
  private container: Container;

  constructor(moduleCls: Constructor<any>) {
    this.moduleCls = moduleCls;
    this.name = moduleCls.name;
    this.container = new Container();
  }

  setChildren(children: ModuleContext[]) {
    this.children = children;
  }

  setProviders(providers: Constructor<any>[]) {
    providers.forEach((provider) => {
      this.container.setProvider(provider.name, provider);
    });
  }

  getChildren() : ModuleContext[] {
    return this.children;
  }

  getName() : string {
    return this.name;
  }

  getModuleCls() : Constructor<any> {
    return this.moduleCls;
  }

  getProviders(): Constructor<any>[] {
    return this.container.getProviders();
  }
}
