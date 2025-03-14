// 节流函数
export const throttle = (fn, delay) => {
    let lastTime = 0;
    return function (...args) {
      const now = new Date().getTime();
      if (now - lastTime >= delay) {
        fn.apply(this, args);
        lastTime = now;
      }
    }
  }
  // 睡眠延迟函数
  export const sleep = (delay) => {
    return new Promise((resolve) => setTimeout(resolve, delay))
  }
  
  