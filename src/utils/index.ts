import fetch from 'node-fetch';
export async function getArUSDPrice(): Promise<number> {
  let usdPrice = 0;
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=arweave&vs_currencies=usd'
    );
    usdPrice = (await res.clone().json()).arweave.usd;
    return usdPrice;
  } catch (err) {
    console.log('Error getting AR/USD price from Coingecko');
    return 0;
  }
}

export function winstonToAr(winston: number): number {
  if (!Number.isInteger(winston))
    throw new Error(`Winston value not an integer: ${winston}`);
  return winston * 0.000_000_000_001;
}

export async function getWinstonPriceForByteCount(
  byteCount: number
): Promise<number> {
  const response = await fetch(`https://arweave.net/price/${byteCount}`);
  const winstonAsString = await response.text();
  return +winstonAsString;
}
