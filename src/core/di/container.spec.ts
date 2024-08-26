import { Container } from './container';

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
    container.set(token, FooClass);

    // then
    expect(container.get(token)).toEqual(new FooClass());
  });

  it('token 이 없을 경우 에러를 반환한다.', () => {
    // given
    const container = new Container();
    const token = 'TOKEN';
    // when
    // then
    expect(() => container.get(token)).toThrowError();
  });
});

export class TestClass {
  constructor() {}
  private id = 1;
}

export class FooClass {
  constructor() {}
  private id = 2;
}
