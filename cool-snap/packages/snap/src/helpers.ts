// Game Plan - Flow
// Task 1 - User Installs the Snap to their wallet after connecting
// Task 2 - Safe Account is created for the user inside Snap , and the owner is set to the current connected wallet
// Task 3 - websites can requestTransaction to be sent , or signed via Snap
// Task 4 - Generate a new metamask address for the user
// Task 5 - Add the address to thier wallet , meaning there is another acc for the user , showing them the dialog to add to the account
// Task 6 - Change the Owner of the Safe

import {
  BIP44Node,
  getBIP44AddressKeyDeriver,
  SLIP10Node,
} from '@metamask/key-tree';

export const createWallet = async (
  addressIndex: number,
): Promise<BIP44Node> => {
  const testnetNode = await snap.request({
    method: 'snap_getBip44Entropy',
    params: {
      coinType: 1,
    },
  });

  const deriveTestnetAddress = await getBIP44AddressKeyDeriver(testnetNode);

  const newKey = await deriveTestnetAddress(addressIndex);

  return newKey;
};

export const createWalletViaBit32 = async (addressIndex: number) => {
  const testnetNode = await snap.request({
    method: 'snap_getBip32Entropy',
    params: {
      // Must be specified exactly in the manifest
      path: ['m', "44'", "1'"],
      curve: 'secp256k1',
    },
  });

  const deriveTestnetAddress = await SLIP10Node.fromJSON(testnetNode);

  const accountKey = await deriveTestnetAddress.derive([
    `bip32:${addressIndex}'`,
  ]);
  console.log(accountKey);
  return accountKey;
};

// we can convert it to an address of safe addresses
// We have to store the EOAs too
export const storeAddressOnSnap = async (address: `0x${string}`) => {
  await snap.request({
    method: 'snap_manageState',
    params: {
      operation: 'update',
      newState: { safeAddress: address },
    },
  });
};

export const getStoredState = async () => {
  const persistedData = await snap.request({
    method: 'snap_manageState',
    params: { operation: 'get' },
  });

  // console.log(persistedData);
  return persistedData;
};
