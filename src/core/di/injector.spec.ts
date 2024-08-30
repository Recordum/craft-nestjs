import { DependencyClass } from './container.spec';
import { Injectable, Module } from './decorators';
import { Injector } from './injector';
import { ModuleRef } from './module-ref';
import { RootModule } from './module-ref.spec';

describe('Injector', () => {
  it('inject : provider에 등록된 의존성을 주입한다.', () => {
    @Injectable()
    class ChildClass {
      constructor() {}
    }

    @Injectable()
    class DependencyClass {
      constructor(private readonly childClass: ChildClass) {}
    }

    @Module({
      providers: [DependencyClass, ChildClass],
    })
    class RootModule {}

    // given
    const moduleRef = new ModuleRef(RootModule);
    moduleRef.initialize();

    const injector = new Injector(moduleRef);

    // when
    injector.inject();

    // then
    const dependencyClass = injector.findInstance('DependencyClass');
    expect(dependencyClass).toBeDefined();
    expect(dependencyClass).toBeInstanceOf(DependencyClass);

    const childClass = injector.findInstance('ChildClass');
    expect(childClass).toBeDefined();
    expect(childClass).toBeInstanceOf(ChildClass);
  });
  it('inject : module안에서 의존하고 있는 class가 Provider에 제공되지 않았을때 error를 반환한다', () => {});
  it('inject : module에서 export한 provider는 이 module을 의존하는 다른 module에게 제공되어진다', () => {});
});
