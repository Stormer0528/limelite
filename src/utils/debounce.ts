// https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore?tab=readme-ov-file#_debounce
export function debounce(func: (...args: any[]) => void, wait: number, immediate?: boolean) {
  let timeout: NodeJS.Timeout | null = null;
  return function debounceFn(this: any, ...args: any[]) {
    if (timeout) {
      clearTimeout(timeout);
    }

    if (immediate && !timeout) func.apply(this, args);
    timeout = setTimeout(() => {
      timeout = null;
      if (!immediate) func.apply(this, args);
    }, wait);
  };
}
