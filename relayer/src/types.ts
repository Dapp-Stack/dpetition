export interface RequestAuthorisation {
  identityAddress: string;
  address: string;
  index?: number
  deviceInfo: {
    ipAddress: string;
    city: string;
    name: string;
    os: string;
    browser: string;
    time: string;
  }
}
