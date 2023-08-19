// Steps Key rotatioan
// Task 1 - User Installs the Snap to their wallet
// Task 2 - Generate a new metamask address for the user
// Task 3 - Add the address to thier wallet , meaning there is another acc for the user
// Task 4 - Change the Owner
import { getBIP44AddressKeyDeriver } from '@metamask/key-tree';

export const createWallet = async () => {
  const testnetNode = await snap.request({
    method: 'snap_getBip44Entropy',
    params: {
      coinType: 1,
    },
  });

  const deriveTestnetAddress = await getBIP44AddressKeyDeriver(testnetNode);

  const addressKey0 = await deriveTestnetAddress(0);
  console.log(addressKey0);

  const addressKey1 = await deriveTestnetAddress(0);
  console.log(addressKey1);
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
