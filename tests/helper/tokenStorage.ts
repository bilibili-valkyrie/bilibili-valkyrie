class Token {
  token = "";

  setToken(tokenToSet: string) {
    this.token = tokenToSet;
  }
}
const tokenStorage = new Token();
export default tokenStorage;
