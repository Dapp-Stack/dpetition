import { ensSuffix } from '../config';

export const usernameToEns = (username: string) => `${username}.${ensSuffix}`;
