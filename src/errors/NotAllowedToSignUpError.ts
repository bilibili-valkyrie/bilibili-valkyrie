export default class NotAllowedToSignUpError extends Error {
  message: string;

  name = "NotAllowedToSignUpError";

  constructor(message: string) {
    super();
    this.message = message;
  }
}
