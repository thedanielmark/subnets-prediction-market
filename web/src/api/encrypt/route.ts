'use server';
// @ts-ignore
import * as secp256k1 from 'secp256k1/elliptic.js';
import * as miscreant from 'miscreant';
import { NextResponse } from 'next/server';
import { toUtf8 } from '@cosmjs/encoding';

let provider = new miscreant.PolyfillCryptoProvider();

const encrypt = async (key: Uint8Array, message: string) => {
  const siv = await miscreant.SIV.importKey(key, 'AES-SIV', provider);
  const plaintext = toUtf8(JSON.stringify(message));

  try {
    let ciphertext = await siv.seal(plaintext, []);
    return {
      success: true,
      ciphertext,
    };
  } catch (e) {
    return {
      success: false,
      message: 'Error encrypting message',
    };
  }
};

export async function POST(request: Request) {
  const body = await request.json();
  let privateKey = body.privateKey;
  let publicKey = body.publicKey;
  let message = body.message;

  if (!privateKey || !publicKey || !message) {
    return NextResponse.json({ error: 'Invalid input' });
  }

  let privateKeyArray = new Uint8Array(
    privateKey.split(',').map((num: string) => parseInt(num, 10))
  );
  let publicKeyArray = new Uint8Array(
    publicKey.split(',').map((num: string) => parseInt(num, 10))
  );
  const ecdhPointX = secp256k1.ecdh(publicKeyArray, privateKeyArray);
  let keyData = Uint8Array.from(ecdhPointX);
  let encryptedData = await encrypt(keyData, message);
  return NextResponse.json({ keyData: keyData.toString(), encryptedMessage: encryptedData.ciphertext });
  //   return Response.json({ res });
}
