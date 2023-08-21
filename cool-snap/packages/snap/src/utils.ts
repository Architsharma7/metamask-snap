// Game Plan - Flow
// Task 1 - User Installs the Snap to their wallet after connecting
// Task 2 - Safe Account is created for the user inside Snap , and the owner is set to the current connected wallet
// Task 3 - websites can requestTransaction to be sent , or signed via Snap
// Task 4 - Generate a new metamask address for the user
// Task 5 - Add the address to thier wallet , meaning there is another acc for the user , showing them the dialog to add to the account
// Task 6 - Change the Owner of the Safe

// A User can only have 1 Safe for now

import {
  BIP44Node,
  getBIP44AddressKeyDeriver,
  SLIP10Node,
} from '@metamask/key-tree';

// User has to select all the accounts they want to get
// Or we have to maintain the local state of all new EOAs we have
export const handleGetAllAddresses = async (): Promise<any> => {
  try {
    await snap.request({
      method: 'snap_notify',
      params: {
        type: 'inApp',
        message: 'Select all the accounts',
      },
    });
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    console.log(accounts);
    return accounts;
  } catch (error) {
    if (error.code === 4001) {
      // EIP-1193 userRejectedRequest error
      console.log('Please connect to MetaMask.');
    } else {
      console.error(error);
    }
  }
};

export const handleCreateNewPair = async () => {
  // get the connectedEOAs
  // get Stored state
  // find the index
  // create new Pair
  // Store the new State
};

export const handleCreateSafe = async () => {
  // create the safe
  // store the address
};

export const handleGetSafe = async () => {
  // get the state
  // extract Safe Address
};

export const handleSendSafetx = async () => {
  // take the tx info
  // prepare and send
};

export const handleSignSafetx = async () => {
  // take the tx info
  // prepare and sign
};

export const handleChangeSafeOwner = async () => {
  // get new Owner & old Owner
  // do a change owner tx by the old Owner
};
