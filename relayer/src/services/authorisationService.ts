import { RequestAuthorisation } from "../types";

interface PendingAuthorisations {
  [identityAddress: string]: RequestAuthorisation[];
}

export default class AuthorisationService {
  private pendingAuthorisations: PendingAuthorisations = {};
  private index: number = 0;

  public addRequest(requestAuthorisation: RequestAuthorisation) {
    requestAuthorisation.index = this.index;
    const { identityAddress } = requestAuthorisation
    this.pendingAuthorisations[identityAddress] = this.pendingAuthorisations[identityAddress] || [];
    this.pendingAuthorisations[identityAddress].push(requestAuthorisation);
    this.index++;
  }

  public getPendingAuthorisations(identityAddress: string) {
    return this.pendingAuthorisations[identityAddress] || [];
  }

  public removeRequest(identityAddress: string, address: string) {
    const filter = (requestAuthorisation: RequestAuthorisation) => requestAuthorisation.address !== address
    this.pendingAuthorisations[identityAddress] = this.getPendingAuthorisations(identityAddress).filter(filter);
      
  }
}
