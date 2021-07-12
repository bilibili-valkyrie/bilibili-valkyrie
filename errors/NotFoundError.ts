export default class NotFoundError extends Error {
  message: string;

  name = "NotFoundError";

  constructor(message: string) {
    super();
    this.message = message;
  }
}
