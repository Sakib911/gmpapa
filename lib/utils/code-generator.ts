import cryptoRandomString from 'crypto-random-string';

export async function generateRedeemCode(prefix: string = 'GMP'): Promise<string> {
  const randomBytes = cryptoRandomString({
    length: 8,
    type: 'alphanumeric',
    uppercase: true
  });

  return `${prefix}-${randomBytes}`;
}