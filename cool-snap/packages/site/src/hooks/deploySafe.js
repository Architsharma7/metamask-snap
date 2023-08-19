import {useState} from "react"
import { ethers } from 'ethers';
import { EthersAdapter } from '@safe-global/protocol-kit';
import SafeApiKit from '@safe-global/api-kit';
import Safe,{ SafeFactory, getUserSafe } from '@safe-global/protocol-kit';
import { SafeAccountConfig } from '@safe-global/protocol-kit';
import { getUserSafe } from "../components/safeMethods";

const txServiceUrl = 'https://safe-transaction-goerli.safe.global';
const RPC_URL = 'https://eth-goerli.public.blastapi.io';
const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
const [safeSDK, setSafeSDK] = useState();
const [safeAddress ,setSafeAddress] = useState();
// Initialize signers
// have to get it by snap somehow
const ownerSigner = new ethers.Wallet(process.env.OWNER_PRIVATE_KEY, provider);

const ethAdapter = new EthersAdapter({
  ethers,
  signerOrProvider: ownerSigner,
});

const safeService = new SafeApiKit({
  txServiceUrl,
  ethAdapter: ethAdapter,
});


export const createSafeWallet = async () => {
  try {
    const safeFactory = await SafeFactory.create({ ethAdapter: ethAdapter });

    const owners = [`${await ownerSigner.getAddress()}`];
    const threshold = 1;

    const safeAddress = await getUserSafe(ownerSigner);
    console.log(`deployed your safe :`)
    console.log(`https://goerli.etherscan.io/address/${safeAddress}`);
    console.log(safeAddress);
    if (safeAddress) {
      const safeSDK = await Safe.create({ ethAdapter, safeAddress });
      setSafeSDK(safeSDK);
      setSafeAddress(safeAddress);
      setsafeSetupComplete(true);
      return;
    }

    const safeAccountConfig = {
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
