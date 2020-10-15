export class User {
  constructor(
    // by adding access keywords in front of the fields its a shortcut way to declare them at the same time
    public email: string,
    public id: string,
    private _token: string,
    private _tokenExpirationDate: Date
    )
    {}

    get token() {
      if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
        return null;
      }
      return this._token;
    }
}
