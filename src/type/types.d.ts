declare module "*.json" {
  export interface Wallet {
    kty: string;
    n: string;
    e: string;
    d: string;
    p: string;
    q: string;
    dp: string;
    dq: string;
    qi: string;
  }
  export const wallet: Wallet;
}
