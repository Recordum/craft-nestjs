import { Container } from './container';
import { Injectable } from './decorators';

/**
 * HasMap 을 사용하여 DI Container 를 생성하고 관리한다.
 */
describe('Container', () => {
  it('token 을 key로 class type을 등록 할 수있다. .', () => {
    // given
    const container = new Container();
    const token = 'TOKEN';
    // when
    container.setProvider(token, TestClass);
    // then
    expect(container.getProvider<TestClass>(token)).toEqual(TestClass);
  });

  it('같은 token 으로 여러번 set 할 경우 마지막에 set 한 class type의 instance 을 반환한다.', () => {
    // given
    const container = new Container();
    const token = 'TOKEN';
    // when
    container.setProvider(token, TestClass);
    container.setProvider(token, Test2Class);

    // then
    expect(container.getProvider(token)).toEqual(Test2Class);
  });

  it('token 이 없을 경우 에러를 반환한다.', () => {
    // given
    const container = new Container();
    const token = 'TOKEN';
    // when
    // then
    expect(() => container.getProvider(token)).toThrowError();
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


