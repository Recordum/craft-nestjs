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

  getChildren() {
    return this.children;
  }
}
