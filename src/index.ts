import Arweave from 'arweave';
// import { PermPicMeta } from "./type/fileMeta";
import { permPicUser } from './type/base';
import Transaction from 'arweave/node/lib/transaction';
import {
  SerializedUploader,
  TransactionUploader,
} from 'arweave/node/lib/transaction-uploader';
import { PermPicVersion, arweaveGql } from './setting';
import { JWKInterface } from 'arweave/node/lib/wallet';
import { getWinstonPriceForByteCount, winstonToAr } from './utils';
import uuid from 'uuid';

export const arweave = Arweave.init({
  host: 'arweave.net', // Arweave Gateway
  //host: 'arweave.dev', // Arweave Dev Gateway
  port: 443,
  protocol: 'https',
  timeout: 600000,
});

export async function preparePermPicTransaction(
  user: permPicUser,
  fileData: any,
  metaData: any
): Promise<any> {
  try {
    let transaction = await arweave.createTransaction(
      {
        data: fileData,
      },
      user.walletPrivateKey
    );

    transaction.addTag('PermPicVersion', PermPicVersion);
    transaction.addTag('PermPicId', uuid.v4());

    for (const key in metaData) {
      if (Object.prototype.hasOwnProperty.call(metaData, key)) {
        transaction.addTag(key, metaData[key]);
      }
    }

    await arweave.transactions.sign(transaction, user.walletPrivateKey);

    return transaction;
  } catch (error) {
    console.log(`error: preparePermPicTransaction ${error}`);
    return null;
  }
}

export async function PermPicGetUploader(
  transaction: string | Transaction | SerializedUploader
): Promise<TransactionUploader> {
  let uploader = await arweave.transactions.getUploader(transaction);
  return uploader;
}

export async function permPicUpload(tx: Transaction): Promise<any> {
  for await (const uploader of arweave.transactions.upload(tx)) {
    console.log(`${uploader.pctComplete}% Complete`);
    return uploader;
  }
}
// Gets a public key for a given JWK
export async function getAddressForWallet(
  walletPrivateKey: JWKInterface
): Promise<string> {
  return arweave.wallets.jwkToAddress(walletPrivateKey);
}

export async function getArPrice(bytes: number) {
  const winston = await getWinstonPriceForByteCount(bytes);
  return winstonToAr(winston);
}

export async function getPermPicData(txId: string) {
  return await arweave.transactions
    .getData(txId, {
      decode: true,
      string: true,
    })
    .then(data => {
      return data;
    });
}

export async function getPermPicLogList(owner: string) {
  const query = {
    query: `query {
      transactions(
        owners: ["${owner}"]
        tags: [
          { name: "PermPicVersion", values: "${PermPicVersion}"}
        ]
      ) {
        edges {
          node {
              id
            tags {
              value
              name
            }
            data {
              size
              type
            }
            block {
              id
              previous
              height
              timestamp
            }
          }
         cursor
        }
      }
    }`,
  };
  console.log(query)
  const response = await arweave.api.request().post(arweaveGql, query);
  const { data } = response.data;
  const { transactions } = data;
  const { edges } = transactions;
  return edges;
}

export async function getWalletArBalance(address: string) {
  return await arweave.wallets.getBalance(address).then((balance) => {
    return arweave.ar.winstonToAr(balance);
  });
}