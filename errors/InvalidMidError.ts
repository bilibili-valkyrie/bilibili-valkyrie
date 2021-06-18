export default class InvalidMidError extends Error {
  message: string;

  name = "InvalidMidError";

  constructor(error: { message: string }) {
    super(error.message);
    this.message = error.message;
  }
}
