import SafeApiKit from '@safe-global/api-kit';
import { EthersAdapter } from '@safe-global/protocol-kit';
import { ethers } from 'ethers';
import { useState } from 'react';
import Safe, { SafeFactory } from '@safe-global/protocol-kit';
import { SafeAccountConfig } from '@safe-global/protocol-kit';
import { SafeTransactionDataPartial } from '@safe-global/safe-core-sdk-types';
import { OperationType } from '@safe-global/safe-core-sdk-types';

const txServiceUrl = 'https://safe-transaction-goerli.safe.global';
const RPC_URL = 'https://eth-goerli.public.blastapi.io';
const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
const signer = new ethers.Wallet('config.SIGNER_ADDRESS_PRIVATE_KEY', provider);
const [safeSDK, setSafeSDK] = useState<any>();
const [safeAddress, setSafeAddress] = useState<any>();
const [safeSetupComplete, setsafeSetupComplete] = useState<boolean>(false);
// Initialize signers
// have to get it by snap somehow
const ownerSigner = new ethers.Wallet(
  'process.env.OWNER_PRIVATE_KEY',
  provider,
);

const ethAdapter = new EthersAdapter({
  ethers,
  signerOrProvider: ownerSigner,
});

const safeService = new SafeApiKit({
  txServiceUrl,
  ethAdapter: ethAdapter,
});

const intializeSafeAPI = (signer: any) => {
  const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: signer,
  });

  const safeSAPIService = new SafeApiKit({
    txServiceUrl: 'https://safe-transaction-goerli.safe.global',
    ethAdapter,
  });

  return safeSAPIService;
};

const initializeSafeSDK = async (safeAddress: any) => {
  const safeSDK = await Safe.create({
    ethAdapter,
    safeAddress,
  });

  return safeSDK;
};

export const getuserSafe = async (signer: any) => {
  const userAddress = await signer.getAddress();
  const safeService = intializeSafeAPI(signer);
  const safes = await safeService.getSafesByOwner(userAddress);
  const safeAddress = safes.safes[0];
  return safeAddress;
};

export const createSafeWallet = async () => {
  try {
    const safeFactory = await SafeFactory.create({ ethAdapter: ethAdapter });

    const owners = [`${await ownerSigner.getAddress()}`];
    const threshold = 1;

    const safeAddress = await getuserSafe(ownerSigner);
    console.log(`deployed your safe :`);
    console.log(`https://goerli.etherscan.io/address/${safeAddress}`);
    console.log(safeAddress);
    if (safeAddress) {
      const safeSDK = await Safe.create({ ethAdapter, safeAddress });
      setSafeSDK(safeSDK);
      setSafeAddress(safeAddress);
      setsafeSetupComplete(true);
      return;
    }

    const safeAccountConfig: SafeAccountConfig = {
      owners,
      threshold,
    };
    console.log(safeAccountConfig);

    const safeSdk = await safeFactory.deploySafe({ safeAccountConfig });

    console.log('Creating and deploying the new safe');
    const newSafeAddress = await safeSdk.getAddress();
    console.log(newSafeAddress);

    if (newSafeAddress) {
      setsafeSetupComplete(true);
    }
    setSafeSDK(safeSdk);
    setSafeAddress(newSafeAddress);
  } catch (error) {
    console.log(error);
  }
};

export const proposeTransactionOnSafe = async (
  destinationAddress: any,
  amount: any,
  data: any,
  safeAddress: any,
) => {
  const safe = initializeSafeSDK(safeAddress);
  const safeTransactionData: SafeTransactionDataPartial = {
    to: destinationAddress,
    value: amount,
    data: data,  // "0x"
    operation: OperationType.Call,
  };

  const safeTransaction = await (
    await safe
  ).createTransaction({ safeTransactionData });

  const safeTxHash = await (await safe).getTransactionHash(safeTransaction);

  console.log(safeTxHash);

  const signature = await (await safe).signTransactionHash(safeTxHash);

  await safeService.proposeTransaction({
    safeAddress: await (await safe).getAddress(),
    safeTransactionData: safeTransaction.data,
    safeTxHash: safeTxHash,
    senderAddress: await signer.getAddress(),
    senderSignature: signature.data,
  });

  return safeTxHash;
};

export const executeTransactionOnSafe = async (safeTxHash: any) => {
  const safeTransaction = getATransactionsOnSafe(safeTxHash);
  const executeTxResponse = await safeSDK.executeTransaction(safeTransaction);
  const receipt = await executeTxResponse.transactionResponse?.wait();

  console.log('Transaction executed:');
  console.log(`https://goerli.etherscan.io/tx/${receipt.transactionHash}`);
};

export const getATransactionsOnSafe = async (safeTxHash: any) => {
  const transaction = await safeService.getTransaction(safeTxHash);
  console.log(transaction);
  return transaction;
};

export const getPendingTransactionsOnSafe = async () => {
  const pendingTransactions = (
    await safeService.getPendingTransactions(safeAddress)
  ).results;
  console.log(pendingTransactions);
  return pendingTransactions;
};
