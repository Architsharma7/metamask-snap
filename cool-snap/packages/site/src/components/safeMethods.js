import SafeApiKit from "@safe-global/api-kit";
import { EthersAdapter } from "@safe-global/protocol-kit";
import { ethers } from "ethers";

export const getUserSafe = async (signer) => {
    const userAddress = await signer.getAddress();
    const safeService = intializeSafeAPI(signer);
    const safes = await safeService.getSafesByOwner(userAddress);
    const safeAddress = safes.safes[0];
    return safeAddress;
  };

const intializeSafeAPI = (signer) => {
  const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: signer,
  });

  const safeSAPIService = new SafeApiKit({
    txServiceUrl: "https://safe-transaction-goerli.safe.global",
    ethAdapter,
  });

  return safeSAPIService;
};