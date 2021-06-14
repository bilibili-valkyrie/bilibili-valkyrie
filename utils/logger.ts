/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const info = (...params: any): void => {
  console.log(...params);
};

const error = (...params: any): void => {
  console.error(...params);
};

export default { info, error };
