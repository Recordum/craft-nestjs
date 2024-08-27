import { ModuleContext } from './module-context';

describe('ModuleContext', () => {
  it('setChildren : 자식 ModuleContext를 등록 한다', () => {
    // given
    const module = new ModuleContext(TestModule);
    const child = new ModuleContext(ChildModule);
    const child2 = new ModuleContext(Child2Module);

    // when
    module.setChildren([child, child2]);

    // then
    expect(module.getChildren()).toEqual([child, child2]);
  });

});

export class TestModule {}
export class ParentModule {}
export class ChildModule {}
export class Child2Module {}
