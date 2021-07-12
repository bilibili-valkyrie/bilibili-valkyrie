/** Promisified setTimeout function.
 * @param {number} ms */
const wait = (ms: number): Promise<unknown> =>
  new Promise((resolve) => setTimeout(resolve, ms));
export default wait;
