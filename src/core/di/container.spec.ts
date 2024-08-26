import { Container, Injectable } from './container';

/**
 * HasMap 을 사용하여 DI Container 를 생성하고 관리한다.
 */
describe('Container', () => {
  it('token 을 key로 class type을 등록 할 수있다. .', () => {
    // given
    const container = new Container();
    const token = 'TOKEN';
    // when
    container.set(token, TestClass);
    // then
    expect(container.get<TestClass>(token)).toEqual(new TestClass());
  });

  it('같은 token 으로 여러번 set 할 경우 마지막에 set 한 class type의 instance 을 반환한다.', () => {
    // given
    const container = new Container();
    const token = 'TOKEN';
    // when
    container.set(token, TestClass);
    container.set(token, Test2Class);

    // then
    expect(container.get(token)).toEqual(new Test2Class());
  });

  it('token 이 없을 경우 에러를 반환한다.', () => {
    // given
    const container = new Container();
    const token = 'TOKEN';
    // when
    // then
    expect(() => container.get(token)).toThrowError();
  });

  it('provider가 의존하는 class type이 class name을 token 하여 등록되어 있다면 의존성을 해결하고 instance를 반환한다', () => {
    // given
    const container = new Container();
    const token = 'RESOLVE_DEPENDENCY';
    // when
    container.set('DependencyClass2', DependencyClass2);
    container.set('Test2Class', Test2Class);
    container.set('TestClass', TestClass);
    container.set(token, DependencyClass);

    console.log(container);

    // then
    const instance = container.get(token);
    expect(instance).toBeInstanceOf(DependencyClass);
    expect(instance).toEqual(
      new DependencyClass(
        new TestClass(),
        new DependencyClass2(new Test2Class())
      )
    );
  });
});
@Injectable()
export class TestClass {
  constructor() {}
  private id = 1;
}

@Injectable()
export class Test2Class {
  constructor() {}
  private id = 2;
}

@Injectable()
export class DependencyClass2 {
  constructor(private readonly fooClass: Test2Class) {}
}

@Injectable()
export class DependencyClass {
  constructor(
    private readonly testClass: TestClass,
    private readonly dependencyDepth2: DependencyClass2
  ) {}
}


