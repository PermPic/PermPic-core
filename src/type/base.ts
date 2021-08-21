export interface permPicUser {
  walletPrivateKey: any;
  address: string;
}

export interface Transaction {
  format: BigInteger;
  id: string;
  last_tx: string;
  owner: string;
  tags: any;
  target: string;
  quantity: string;
  data: string;
  data_size: string;
  data_root: string;
  data_tree: any;
  reward: string;
  signature: string;
}
