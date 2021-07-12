/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const info = (...params: any): void => {
  if (process.env.NODE_ENV !== "test") {
    console.log(...params);
  }
};

const error = (...params: any): void => {
  if (process.env.NODE_ENV !== "test") {
    console.error(...params);
  }
};

export default { info, error };
