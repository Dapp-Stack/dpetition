import { Request } from "express";

interface PendingAuthorisations {
  [identityAddress: string]: [{
    key: string;
    deviceInfo: any;
    index: number;
  }];
}

export default class AuthorisationService {
  private pendingAuthorisations: PendingAuthorisations = {};
  private index: number = 0;

  public addRequest(request: Request) {
    const { identityAddress, key, deviceInfo } = request;
    const { index } = this;
    const pendingAuthorisation = { key, deviceInfo, index };
    this.pendingAuthorisations[identityAddress] = this.pendingAuthorisations[identityAddress] || [];
    this.pendingAuthorisations[identityAddress].push(pendingAuthorisation);
    this.index++;
  }

  public getPendingAuthorisations(identityAddress: string) {
    return this.pendingAuthorisations[identityAddress] || [];
  }

  public removeRequest(identityAddress: string, key: string) {
    const lowKey = key.toLowerCase();
    this.pendingAuthorisations[identityAddress] = this.pendingAuthorisations[identityAddress] || [];
    this.pendingAuthorisations[identityAddress] = this.pendingAuthorisations[identityAddress]
      .filter((element) => element.key.toLowerCase() !== lowKey);
  }
}
