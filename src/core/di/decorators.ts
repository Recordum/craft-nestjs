
export function Injectable(): ClassDecorator {
  return (target: any) => {};
}

export function Module(option: { imports?: any[]; providers?: any[] }): ClassDecorator {
  return (target: any) => {
    const imports = option.imports || [];
    const providers = option.providers || [];
    Reflect.defineMetadata('imports', imports, target);
    Reflect.defineMetadata('providers', providers, target);
  };
}``
