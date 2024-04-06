'use server';
// @ts-ignore
import * as secp256k1 from 'secp256k1/elliptic.js';
import { randomBytes } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { NextResponse } from 'next/server';

export const GET = async () => {
  function getPrivateKey() {
    while (true) {
      const privKey = randomBytes(32);
      if (secp256k1.privateKeyVerify(privKey)) return privKey;
    }
  }

  try {
    let privateKey = getPrivateKey();
    let publicKey;

    // get the public key in a compressed format
    publicKey = secp256k1.publicKeyCreate(privateKey);
    return NextResponse.json({
      success: true,
      privateKey: new Uint8Array(privateKey),
      publicKey: publicKey,
    });
  } catch {
    return NextResponse.json({
      success: false,
      message: 'Error generating keys',
    });
  }
};
