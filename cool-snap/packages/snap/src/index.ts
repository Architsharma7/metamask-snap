import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { createWallet, getStoredState, storeState } from './helpers';
import { panel, text, heading, copyable, divider } from '@metamask/snaps-ui';
import {
  handleCreateNewPair,
  handleCreateSafe,
  handleGetAllAddresses,
  handleGetSafe,
} from './utils';

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */
export const onRpcRequest: OnRpcRequestHandler = ({ origin, request }) => {
  switch (request.method) {
    // case 'hello':
    //   return handleGetAllAddresses();
    case 'get-addresses':
      return handleGetAllAddresses();
    case 'create-new-pair':
      return handleCreateNewPair();
    case 'create-safe':
      return handleCreateSafe(request.params);
    case 'get-safe':
      return handleGetSafe();
    // case 'send-transaction-safe':
    //   return handleSendSafetx();
    // case 'sign-transaction-safe':
    //   return handleSignSafetx();
    // case 'change-owner-safe':
    //   return handleChangeSafeOwner();
    default:
      throw new Error('Method not found.');
  }
};
