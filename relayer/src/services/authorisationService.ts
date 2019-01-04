interface PendingAuthorisations {
  [identityAddress: string]: {
    key: number;
    deviceInfo: any;
    index: number;
  };
}

export default class AuthorisationService {
  private pendingAuthorisations = {};
  private index: number = 0;

  public addRequest(request) {
    const { identityAddress, key, deviceInfo } = request;
    const { index } = this;
    const pendingAuthorisation = { key, deviceInfo, index };
    this.pendingAuthorisations[identityAddress] = this.pendingAuthorisations[identityAddress] || [];
    this.pendingAuthorisations[identityAddress].push(pendingAuthorisation);
    this.index++;
  }

  public getPendingAuthorisations(identityAddress) {
    return this.pendingAuthorisations[identityAddress] || [];
  }

  public removeRequest(identityAddress, key) {
    const lowKey = key.toLowerCase();
    this.pendingAuthorisations[identityAddress] = this.pendingAuthorisations[identityAddress] || [];
    this.pendingAuthorisations[identityAddress] = this.pendingAuthorisations[identityAddress]
      .filter((element) => element.key.toLowerCase() !== lowKey);
  }
}
