import { Injectable, Module } from './decorators';
import { ModuleContext } from './module-context';
import { ModuleRef } from './module-ref';

describe('ModuleRef', () => {
  it('initialize : param 으로 넘긴 module을 root로 하여 모듈 의존성을 등록한다', () => {
    // given
    const moduleRef = new ModuleRef(RootModule);

    // when
    moduleRef.initialize();

    // then
    const rootModule: ModuleContext = moduleRef.getRootModule();
    expect(rootModule.getName()).toBe('RootModule');

    const dependencyModules = rootModule.getChildren();
    expect(dependencyModules.length).toBe(2);

    const dependencyModule1 = dependencyModules.find(
      (module) => module.getName() === 'DependencyModule1'
    );
    const dependencyModule2 = dependencyModules.find(
      (module) => module.getName() === 'DependencyModule2'
    );

    expect(dependencyModule1).toBeDefined();
    expect(dependencyModule2).toBeDefined();

    const childModules = dependencyModule1!.getChildren();
    expect(childModules.length).toBe(2);

    const childModule1 = childModules.find(
      (module) => module.getName() === 'ChildModule1'
    );
    const childModule2 = childModules.find(
      (module) => module.getName() === 'ChildModule2'
    );

    expect(childModule1).toBeDefined();
    expect(childModule2).toBeDefined();
  });

  it('initialize : param 으로 넘긴 module의 provide를 등록한다', () => {
    //given
    const moduleRef = new ModuleRef(RootModule);

    //when
    moduleRef.initialize();
    //then
    const rootModule: ModuleContext = moduleRef.getRootModule();
    const providers = rootModule.getProviders();

    expect(providers.length).toBe(1);
    expect(providers[0]).toBe(RootProvider);

    const dependencyModules = rootModule.getChildren();
    const dependencyModule1 = dependencyModules.find(
      (module) => module.getName() === 'DependencyModule1'
    );
    const dependencyProviders1 = dependencyModule1!.getProviders();
    expect(dependencyProviders1.length).toBe(1);
    expect(dependencyProviders1[0]).toBe(DependencyProvider1);

    const dependencyModule2 = dependencyModules.find(
      (module) => module.getName() === 'DependencyModule2'
    );
    const dependencyProviders2 = dependencyModule2!.getProviders();
    expect(dependencyProviders2.length).toBe(1);
    expect(dependencyProviders2[0]).toBe(DependencyProvider2);

    const childModules = dependencyModule1!.getChildren();
    const childModule1 = childModules.find(
      (module) => module.getName() === 'ChildModule1'
    );
    const childProviders1 = childModule1!.getProviders();
    expect(childProviders1.length).toBe(1);
    expect(childProviders1[0]).toBe(ChildProvider1);
  });

  it('initialize : 모듈이 순환 참조하면 error를 발생시킨다 ', () => {
    @Module({
      imports: [],
    })
    class ChildModule {}
    @Module({
      imports: [ChildModule],
    })
    class ParentModule {}
    @Module({
      imports: [ParentModule],
    })
    class GrandParentModule {}

    @Module({
      imports: [GrandParentModule],
    })
    class CircularRootModule {}

    Reflect.defineMetadata('imports', [GrandParentModule], ChildModule);

    // given
    const moduleRef = new ModuleRef(CircularRootModule);

    // when-then
    expect(() => moduleRef.initialize()).toThrowError(
      'Circular dependency detected'
    );
  });

  it('initialize : 단방향 의존을 한다면 여러 모듈이 하나의 모듈을 의존 할 수 있다. ', () => {
    @Module({
      imports: [],
    })
    class AcyclicModule {}

    @Module({
      imports: [AcyclicModule],
    })
    class AcyclicTestModule1 {}

    @Module({
      imports: [AcyclicModule],
    })
    class AcyclicTestModule2 {}

    @Module({
      imports: [AcyclicTestModule1, AcyclicTestModule2],
    })
    class AcyclicRootModule {}

    // given
    const moduleRef = new ModuleRef(AcyclicRootModule);

    // when-then
    expect(() => moduleRef.initialize()).not.toThrowError();
  });

  it('traverse : 모듈을 순회하며 callback 함수를 실행한다', () => {
    // given
    const moduleRef = new ModuleRef(RootModule);
    moduleRef.initialize();
    // when
    const callback = jest.fn((moduleContext: ModuleContext) => {
      const name = moduleContext.getName();
    });

    moduleRef.traverse(callback);

    //then
    expect(callback).toHaveBeenCalledTimes(5);
  });
});

@Injectable()
export class RootProvider {}

@Injectable()
export class DependencyProvider1 {}

@Injectable()
export class DependencyProvider2 {}

@Injectable()
export class ChildProvider1 {}

@Injectable()
export class ChildProvider2 {}
``;

@Module({
  providers: [ChildProvider1],
})
export class ChildModule1 {}

@Module({
  providers: [ChildProvider2],
})
export class ChildModule2 {}

@Module({
  imports: [ChildModule1, ChildModule2],
  providers: [DependencyProvider1],
})
export class DependencyModule1 {}

@Module({
  providers: [DependencyProvider2],
})
export class DependencyModule2 {}
@Module({
  imports: [DependencyModule1, DependencyModule2],
  providers: [RootProvider],
})
export class RootModule {}
