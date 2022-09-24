namespace App {
  // autobind decorator
  export const autoBind = (
    _: any,
    _2: string,
    descriptor: PropertyDescriptor
  ) => {
    const originalMethod = descriptor.value;
    const adjDescriptor: PropertyDescriptor = {
      get() {
        const boundfn = originalMethod.bind(this);
        return boundfn;
      },
    };
    return adjDescriptor;
  };
}
