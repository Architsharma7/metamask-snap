// Game Plan - Flow
// Task 1 - User Installs the Snap to their wallet after connecting
// Task 2 - Safe Account is created for the user inside Snap , and the owner is set to the current connected wallet
// Task 3 - websites can requestTransaction to be sent , or signed via Snap
// Task 4 - Generate a new metamask address for the user
// Task 5 - Add the address to thier wallet , meaning there is another acc for the user , showing them the dialog to add to the account
// Task 6 - Change the Owner of the Safe

// A User can only have 1 Safe for now
import { panel, text, heading, copyable, divider } from '@metamask/snaps-ui';
import { createWallet, getStoredState, storeState } from './helpers';
// import SafeClass from './safe';

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
  // const acc = await ethereum.request({ method: 'eth_requestAccounts' });
  // if (!acc) return;
  // console.log(acc);

  // get Stored state
  const storedData = await getStoredState();
  // if (!storedData) return;
  console.log(storedData);

  // // if (!Array.isArray(storedData?.newEOA)) return;

  // const arr = acc.concat(storedData.newEOA);

  // // find the index
  // const totalWallets = arr.length;

  // create new Pair
  const newPair = await createWallet(1);
  console.log(newPair);

  // Store the new State
  const newData = {
    safeAddress: '',
    newEOAs: [newPair.address],
  };
  // console.log(newData);

  await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'alert',
      content: panel([
        heading('Add new Account to Wallet?'),
        text('Please ensure you dont share it with anybody else'),
        text('Here is the new wallet address'),
        copyable(`${newPair.address}`),
        text(`Copy the private key below and Import this as a new account`),
        copyable(`${newPair.privateKey}`),
      ]),
    },
  });

  await storeState(newData);

  return {
    privateKey: newPair.privateKey,
    publicKey: newPair.address,
  };
};

export const handleCreateSafe = async (safeAddress: any) => {
  // create the safe
  //   const safe = new SafeClass(provider, signer);

  //   const safeAddress = safe.createSafeWallet();

  // store the address
  const storedData = getStoredState();

  const newData = {
    safeAddress: safeAddress,
    newEOAs: storedData.newEOAs,
  };

  return 'safeAddress';
};

export const handleGetSafe = async () => {
  // get the state
  const storedData = await getStoredState();
  if (!storedData) return;

  // extract Safe Address
  console.log(storedData?.safeAddress);

  return storedData?.safeAddress;
};

export const handleSendSafetx = async () => {
  // take the tx info
  const storedData = await getStoredState();
  if (!storedData) return;

  const safeAddress = storedData.safeAddress;
  // prepare and send
  // const safe = new SafeClass(provider, signer);

  // // Propose
  // const txHash = await safe.proposeTransactionOnSafe(
  //   destinationAddress,
  //   amount,
  //   data,
  //   safeAddress,
  // );

  // give tx confirmation

  await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'confirmation',
      content: panel([
        heading('New Transaction to Safe ?'),
        text(
          'Would you like to propose transaction through your Safe Smart Contract Wallet',
        ),
        divider(),
        text(
          `The Transaction is sent to ${destinationAddress} from the Safe ${safeAddress}`,
        ),
      ]),
    },
  });

  // execute the tx on Safe
  // const receipt = await safe.executeTransactionOnSafe(txHash);
  // return receipt.transactionHash;

  // confirm the tx
};

// export const handleSignSafetx = async () => {
//   // take the tx info
//   // prepare and sign
//   return '';
// };

// export const handleChangeSafeOwner = async () => {
//   // get new Owner & old Owner
//   // do a change owner tx by the old Owner
//   return '';
// };
