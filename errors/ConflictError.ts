export default class ConflictError extends Error {
  message: string;

  name = "ConflictError";

  constructor(message: string) {
    super();
    this.message = message;
  }
}
