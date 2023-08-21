import SafeApiKit from '@safe-global/api-kit';
import { EthersAdapter } from '@safe-global/protocol-kit';
import { ethers } from 'ethers';
import { useState } from 'react';
import Safe, { SafeFactory } from '@safe-global/protocol-kit';
import { SafeAccountConfig } from '@safe-global/protocol-kit';
import { SafeTransactionDataPartial } from '@safe-global/safe-core-sdk-types';
import { GelatoRelayPack } from '@safe-global/relay-kit';
import { getSafeContract } from '@safe-global/protocol-kit';
import {
  MetaTransactionData,
  MetaTransactionOptions,
  OperationType,
  RelayTransaction,
} from '@safe-global/safe-core-sdk-types';

const txServiceUrl = 'https://safe-transaction-goerli.safe.global';
const RPC_URL = 'https://eth-goerli.public.blastapi.io';
const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
const signer = new ethers.Wallet('config.SIGNER_ADDRESS_PRIVATE_KEY', provider);
const [safeSDK, setSafeSDK] = useState<any>();
const [safeAddress, setSafeAddress] = useState<any>();
const [safeSetupComplete, setsafeSetupComplete] = useState<boolean>(false);

// const ownerSigner = new ethers.Wallet(
//   'process.env.OWNER_PRIVATE_KEY',
//   provider,
// );

// const ethAdapter = new EthersAdapter({
//   ethers,
//   signerOrProvider: ownerSigner,
// });

// const safeService = new SafeApiKit({
//   txServiceUrl,
//   ethAdapter: ethAdapter,
// });

const GELATO_RELAY_API_KEY = process.env.NEXT_PUBLIC_GELATO_RELAY_API_KEY;
const chainId = 5;
const gasLimit = `100000`;
const options: MetaTransactionOptions = {
  gasLimit,
  isSponsored: true,
};

export default class SafeClass {
  ethAdapter: any;
  safeService: any;
  safeSDK: any;
  safeAddress: any;
  signer: any;
  provider: any;
  relayKit: any;
  // Initialize signers
  // have to get it by snap somehow

  constructor(provider: any, signer: any) {
    this.signer = signer;
    this.provider = provider;
    this.initializeRelay();
    this.intializeSafeAPI();
  }

  async initializeRelay() {
    const relayKit = new GelatoRelayPack(GELATO_RELAY_API_KEY!);
    this.relayKit = relayKit;
  }

  async intializeSafeAPI(): Promise<SafeApiKit> {
    const ethAdapter = new EthersAdapter({
      ethers,
      signerOrProvider: this.signer,
    });

    this.ethAdapter = ethAdapter;

    const safeAPIService = new SafeApiKit({
      txServiceUrl: 'https://safe-transaction-goerli.safe.global',
      ethAdapter,
    });

    this.safeService = safeAPIService;

    return safeAPIService;
  }

  async initializeSafeSDK(safeAddress: any): Promise<Safe> {
    const ethAdapter = new EthersAdapter({
      ethers,
      signerOrProvider: this.signer,
    });
    this.ethAdapter = ethAdapter;

    const safeSDK = await Safe.create({
      ethAdapter,
      safeAddress,
    });
    this.safeSDK = safeSDK;

    return safeSDK;
  }

  async getuserSafe() {
    const userAddress = await this.signer.getAddress();
    const safeService = await this.intializeSafeAPI();
    const safes = await safeService.getSafesByOwner(userAddress);
    const safeAddress = safes.safes[0];
    return safeAddress;
  }

  async createSafeWallet() {
    try {
      const safeFactory = await SafeFactory.create({
        ethAdapter: this.ethAdapter,
      });

      const owners = [`${await this.signer.getAddress()}`];
      const threshold = 1;

      const safeAddress = await this.getuserSafe();

      if (safeAddress) {
        this.safeAddress = safeAddress;
        return safeAddress;
      } else {
        const safeAccountConfig: SafeAccountConfig = {
          owners,
          threshold,
        };
        console.log(safeAccountConfig);

        const safeSdk = await safeFactory.deploySafe({ safeAccountConfig });

        console.log('Creating and deploying the new safe');
        const newSafeAddress = await safeSdk.getAddress();
        console.log(`deployed your safe :`);
        console.log(`https://goerli.etherscan.io/address/${newSafeAddress}`);
        console.log(newSafeAddress);
        this.safeAddress = newSafeAddress;

        return newSafeAddress;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async proposeTransactionOnSafe(
    destinationAddress: any,
    amount: any,
    data: any,
    safeAddress: any,
  ) {
    const safe = await this.initializeSafeSDK(safeAddress);
    const safeAPI = await this.intializeSafeAPI();

    const safeTransactionData: SafeTransactionDataPartial = {
      to: destinationAddress,
      value: amount,
      data: data, // "0x"
      operation: OperationType.Call,
    };

    const safeTransaction = await safe.createTransaction({
      safeTransactionData,
    });

    const safeTxHash = await safe.getTransactionHash(safeTransaction);

    console.log(safeTxHash);
    const signature = await safe.signTransactionHash(safeTxHash);

    await safeAPI.proposeTransaction({
      safeAddress: await safe.getAddress(),
      safeTransactionData: safeTransaction.data,
      safeTxHash: safeTxHash,
      senderAddress: await signer.getAddress(),
      senderSignature: signature.data,
    });

    return safeTxHash;
  }

  async executeTransactionOnSafe(safeTxHash: any) {
    const safeTransaction = await this.getATransactionsOnSafe(safeTxHash);
    const executeTxResponse = await this.safeSDK.executeTransaction(
      safeTransaction,
    );
    const receipt = await executeTxResponse.transactionResponse?.wait();

    console.log('Transaction executed:');
    console.log(`https://goerli.etherscan.io/tx/${receipt.transactionHash}`);
    return receipt;
  }

  async getATransactionsOnSafe(safeTxHash: any) {
    const transaction = await this.safeService.getTransaction(safeTxHash);
    console.log(transaction);
    return transaction;
  }

  async getPendingTransactionsOnSafe() {
    const pendingTransactions = (
      await this.safeService.getPendingTransactions(safeAddress)
    ).results;
    console.log(pendingTransactions);
    return pendingTransactions;
  }

  async prepareTransactionRelayerOnSafe(destinationAddress: any, amount: any) {
    const safeTransactionData: MetaTransactionData = {
      to: destinationAddress,
      data: '0x',
      value: amount,
      operation: OperationType.Call,
    };

    const safeTransaction = await safeSDK.createTransaction({
      safeTransactionData,
    });

    const signedSafeTx = await safeSDK.signTransaction(safeTransaction);

    const safeSingletonContract = await getSafeContract({
      ethAdapter: this.ethAdapter,
      safeVersion: await safeSDK.getContractVersion(),
    });

    const encodedTx = await safeSingletonContract.encode('execTransaction', [
      signedSafeTx.data.to,
      signedSafeTx.data.value,
      signedSafeTx.data.data,
      signedSafeTx.data.operation,
      signedSafeTx.data.safeTxGas,
      signedSafeTx.data.baseGas,
      signedSafeTx.data.gasPrice,
      signedSafeTx.data.gasToken,
      signedSafeTx.data.refundReceiver,
      signedSafeTx.encodedSignatures(),
    ]);

    return encodedTx;
  }

  async executeTransactionRelayerSafe(safeAddress: any, encodedTx: any) {
    const relayTransaction: RelayTransaction = {
      target: safeAddress,
      encodedTransaction: encodedTx,
      chainId,
      options,
    };

    const response = await this.relayKit.relayTransaction(relayTransaction);

    console.log(
      `Relay Transaction Task ID: https://relay.gelato.digital/tasks/status/${response.taskId}`,
    );
  }

  async executeTransactionSyncFeeSafe(safeAddress: any, encodedTx: any) {
    const relayTransaction = {
      target: safeAddress,
      encodedTransaction: encodedTx,
      chainId,
      options,
    };
    const response = await this.relayKit.relayTransaction(relayTransaction);
    console.log(
      `Relay Transaction Task ID: https://relay.gelato.digital/tasks/status/${response.taskId}`,
    );
  }
}
