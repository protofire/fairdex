const DEFAULT_TIMEOUT = 6_000; // 6 seconds

export function timeout({ ms, secs }: { ms?: number; secs?: number } = {}) {
  return (
    target: any,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<(...params: any[]) => Promise<any>>,
  ) => {
    const func = descriptor.value;

    if (typeof func === 'function') {
      const delay = ms || (secs && secs * 1_000) || DEFAULT_TIMEOUT;

      descriptor.value = async function(...args) {
        const result = await Promise.race([
          func.apply(this, args),

          new Promise(resolve => {
            setTimeout(() => resolve(), delay);
          }),
        ]);

        return result;
      };
    }
  };
}
