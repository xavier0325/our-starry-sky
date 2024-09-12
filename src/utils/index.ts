export function deBounce<T>(fn: T, delay: number): () => void {
  let timer: NodeJS.Timeout;
  return function (): void {
    const args: any[] = Array.prototype.map.call(arguments, (val) => val);
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(
      () => {
        typeof fn === "function" && fn.apply(null, args);
        clearTimeout(timer);
      },
      delay > 0 ? delay : 100
    );
  };
}

// 爱心形状的函数
export const heartShape = (t: number) => {
  return {
    x: 16 * Math.pow(Math.sin(t), 3),
    y: -(
      13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t)
    ),
  };
};
