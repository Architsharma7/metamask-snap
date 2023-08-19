// Steps Key rotatioan
// Task 1 - User Installs the Snap to their wallet
// Task 2 - Generate a new metamask address for the user
// Task 3 - Add the address to thier wallet , meaning there is another acc for the user
// Task 4 - Change the Owner
import {
  BIP44Node,
  getBIP44AddressKeyDeriver,
  SLIP10Node,
} from '@metamask/key-tree';

export const createWallet = async (): Promise<BIP44Node> => {
  const testnetNode = await snap.request({
    method: 'snap_getBip44Entropy',
    params: {
      coinType: 1,
    },
  });

  const deriveTestnetAddress = await getBIP44AddressKeyDeriver(testnetNode);
  // console.log(deriveTestnetAddress);

  const addressKey0 = await deriveTestnetAddress(0);
  console.log(addressKey0.address);
  console.log(addressKey0.chainCode);
  console.log(addressKey0.privateKey);
  console.log(addressKey0.compressedPublicKey);

  const addressKey1 = await deriveTestnetAddress(1);
  console.log(addressKey1.address);
  console.log(addressKey1.privateKey);

  console.log(addressKey1.compressedPublicKey);
  return await deriveTestnetAddress(0);
};

export const createWalletViaBit32 = async () => {
  const testnetNode = await snap.request({
    method: 'snap_getBip32Entropy',
    params: {
      // Must be specified exactly in the manifest
      path: ['m', "44'", "1'"],
      curve: 'secp256k1',
    },
  });

  const deriveTestnetAddress = await SLIP10Node.fromJSON(testnetNode);

  const accountKey0 = await deriveTestnetAddress.derive(["bip32:0'"]);
  console.log(accountKey0);
  const accountKey1 = await deriveTestnetAddress.derive(["bip32:1'"]);
  console.log(accountKey1);
};

export const storeAddressOnSnap = async () => {
  await snap.request({
    method: 'snap_manageState',
    params: {
      operation: 'update',
      newState: { safeAddress: '0x669c325f6B4e0b346Df864d3E8C041f7A6c94Cb3' },
    },
  });
};

export const getStoredAddress = async () => {
  const persistedData = await snap.request({
    method: 'snap_manageState',
    params: { operation: 'get' },
  });

  console.log(persistedData);
};
