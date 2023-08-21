import { useContext, useState } from 'react';
import styled from 'styled-components';
import { MetamaskActions, MetaMaskContext } from '../hooks';
import { defaultSnapOrigin } from '../config';
import {
  connectSnap,
  getSnap,
  sendHello,
  shouldDisplayReconnectButton,
} from '../utils';
import {
  ConnectButton,
  InstallFlaskButton,
  ReconnectButton,
  // SendHelloButton,
  Card,
} from '../components';
import { ethers } from 'ethers';
import '../styles/global.css';
import SafeClass from '../utils/safe';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  margin-top: 7.6rem;
  margin-bottom: 7.6rem;
  ${({ theme }) => theme.mediaQueries.small} {
    padding-left: 2.4rem;
    padding-right: 2.4rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
    width: auto;
  }
`;

const Heading = styled.h1`
  margin-top: 0;
  margin-bottom: 2.4rem;
  text-align: center;
`;

const Span = styled.span`
  color: ${(props) => props.theme.colors.primary.default};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: 500;
  margin-top: 0;
  margin-bottom: 0;
  ${({ theme }) => theme.mediaQueries.small} {
    font-size: ${({ theme }) => theme.fontSizes.text};
  }
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 64.8rem;
  width: 100%;
  height: 100%;
  margin-top: 1.5rem;
`;

// const Notice = styled.div`
//   background-color: ${({ theme }) => theme.colors.background.alternative};
//   border: 1px solid ${({ theme }) => theme.colors.border.default};
//   color: ${({ theme }) => theme.colors.text.alternative};
//   border-radius: ${({ theme }) => theme.radii.default};
//   padding: 2.4rem;
//   margin-top: 2.4rem;
//   max-width: 60rem;
//   width: 100%;

//   & > * {
//     margin: 0;
//   }
//   ${({ theme }) => theme.mediaQueries.small} {
//     margin-top: 1.2rem;
//     padding: 1.6rem;
//   }
// `;

const ErrorMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.error.muted};
  border: 1px solid ${({ theme }) => theme.colors.error.default};
  color: ${({ theme }) => theme.colors.error.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-bottom: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.small} {
    padding: 1.6rem;
    margin-bottom: 1.2rem;
    margin-top: 1.2rem;
    max-width: 100%;
  }
`;

const Connect = styled.div`
  display: flex;
  padding-top: 1rem;
  padding-bottom: 1rem;
  padding-left: 2rem;
  padding-right: 2rem;
  justify-content: center;
  border-radius: 0.75rem;
  border-width: 1px;
  border-color: #000000;
  width: 100vw;
  background-color: #ffffff;
  margin-top: 3rem;
  align-items: center;
  flex-direction: column;
`;

const Wrapper = styled.div`
  width: 100vw;
`;
const Wrap2 = styled.div`
  display: flex;
  justify-content: center;
`;
const Wrap3 = styled.div`
  padding-top: 2rem;
  padding-bottom: 2rem;
  padding-left: 2rem;
  padding-right: 2rem;
  border-radius: 0.75rem;
  border-width: 1px;
  border-color: white;
`;
const Wrap4 = styled.div`
  display: flex;
  margin-left: 1rem;
  margin-right: 1rem;
  flex-direction: column;
`;
const Boxes = styled.div`
  display: flex;
  padding-top: 0.5rem;
  padding-bottom: 1.5rem;
  padding-left: 2rem;
  padding-right: 2rem;
  flex-direction: column;
  align-items: center;
  border-radius: 0.75rem;
  border-width: 1px;
  border-color: black;
  background-color: #ffffff;
  margin-left: 5rem;
  margin-right: 5rem;
  text-align: center;
  width: 450px;
  margin-bottom: 40px;
`;

const Button = styled.div`
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
  padding-left: 2.5rem;
  padding-right: 2.5rem;
  border-radius: 0.75rem;
  border-width: 1px;
  border-color: #4f46e5;
  background-color: #4f46e5;
  font-size: 2.25rem;
  line-height: 1.75rem;
  text-align: center;
  color: white;
  cursor: pointer;
`;

const Text = styled.p`
  font-size: 3rem;
  line-height: 2rem;
  font-weight: 600;
  color: #4338ca;
`;

const Index = () => {
  const [state, dispatch] = useContext(MetaMaskContext);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>();
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner>();
  // const [safe, setSafe] = useState<SafeClass>();
  const [safeAddress, setSafeAddress] = useState<string>();
  const [userAddress, setUserAddress] = useState<string>();
  const [toAddress, setToAddress] = useState<string>();
  const [amount, setAmount] = useState<number>();
  const [newOwner, setNewOwner] = useState<string>();

  const getUserInfo = async () => {
    const provider = new ethers.providers.Web3Provider(window?.ethereum, 'any');
    // Prompt user for account connections
    await provider.send('eth_requestAccounts', []);
    setProvider(provider);
    const signer = provider.getSigner();
    setSigner(signer);
    console.log('Account:', await signer.getAddress());
    setUserAddress(await signer.getAddress());
    // const safe = new SafeClass(provider, signer);
    // setSafe(safe);

    // const safeAddress = await safe.getuserSafe();
    // console.log(safeAddress);
    // setSafeAddress(safeAddress);
  };

  const handleConnectClick = async () => {
    try {
      await connectSnap();
      const installedSnap = await getSnap();

      dispatch({
        type: MetamaskActions.SetInstalled,
        payload: installedSnap,
      });

      await getUserInfo();

      setIsConnected(true);
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const handleCreateSafe = async () => {
    try {
      const safeAddress = '0x23f977B77d0cBe034300141BF2a74a7307b8dbC1';
      await window.ethereum.request({
        method: 'wallet_invokeSnap',
        params: {
          snapId: defaultSnapOrigin,
          request: {
            method: 'create-safe',
            params: {
              safeAddress,
            },
          },
        },
      });
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  // const handleProposeSafeTx = async () => {
  //   try {
  //     if (!safe) {
  //       return;
  //     }
  //     const safeAddress = await safe.getuserSafe();
  //     const value = ethers.utils.parseEther(amount?.toString());
  //     const data = '0x';
  //     const safeTxHash = await safe.proposeTransactionOnSafe(
  //       toAddress,
  //       value,
  //       data,
  //       safeAddress,
  //     );

  //     await window.ethereum.request({
  //       method: 'wallet_invokeSnap',
  //       params: {
  //         snapId: defaultSnapOrigin,
  //         request: {
  //           method: 'propose-safe-tx',
  //           params: {
  //             toAddress,
  //             value,
  //             safeAddress,
  //           },
  //         },
  //       },
  //     });

  //     const receipt = await safe.executeTransactionOnSafe(safeTxHash);
  //     console.log(receipt.transactionHash);
  //   } catch (e) {
  //     console.error(e);
  //     dispatch({ type: MetamaskActions.SetError, payload: e });
  //   }
  // };

  const handleRotateKeys = async () => {
    try {
      // if (!safe) {
      //   return;
      // }
      const newOwner = await window.ethereum.request({
        method: 'wallet_invokeSnap',
        params: {
          snapId: defaultSnapOrigin,
          request: {
            method: 'create-new-pair',
          },
        },
      });
      console.log(newOwner.address);
      setNewOwner(newOwner.address);

      // const oldOwner = await signer?.getAddress();

      // const tx = await safe.swapOwnersSafe(oldOwner, newOwner);
      // console.log(tx);
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  return (
    <Container>
      {isConnected ? (
        <Wrapper>
          <Wrap2>
            <Wrap3>
              <Wrap4>
                {/* <Boxes>
                  <p className="text">Create a Safe Account</p>
                  <Button>Create Safe Account</Button>
                </Boxes> */}
                <Boxes>
                  <p className="text">Rotate Keys</p>
                  <Button onClick={() => handleRotateKeys()}>
                    Rotate Keys
                  </Button>
                  {newOwner && <p className="text1">{newOwner}</p>}
                </Boxes>
                <Boxes>
                  <Text>Interact With Safe Account</Text>
                  <p className="text1">
                    Send a Transaction Using Your Safe Account
                  </p>
                  <p className="text1">Amount</p>
                  <input type="text" className="input"></input>
                  <Button>Send Transaction</Button>
                </Boxes>
                <Boxes>
                  <p className="text">Safe Details</p>
                  <p className="text2">Account Address</p>
                  <p className="text1">{safeAddress}</p>
                  <p className="text2">Owners Address</p>
                  <p className="text1">{userAddress}</p>
                </Boxes>
              </Wrap4>
            </Wrap3>
          </Wrap2>
        </Wrapper>
      ) : (
        <div>
          <Heading>
            Welcome to <Span>Safe-Rotator</Span>
          </Heading>
          {/* <Subtitle>
        Get started by editing <code>src/index.ts</code>
      </Subtitle> */}
          <CardContainer>
            {state.error && (
              <ErrorMessage>
                <b>An error happened:</b> {state.error.message}
              </ErrorMessage>
            )}
            {!state.isFlask && (
              <Card
                content={{
                  title: 'Install',
                  description:
                    'Snaps is pre-release software only available in MetaMask Flask, a canary distribution for developers with access to upcoming features.',
                  button: <InstallFlaskButton />,
                }}
                fullWidth
              />
            )}
            {!state.installedSnap && (
              <Connect>
                <p className="text">Welcome to Safe Rotator</p>
                <p className="text1">
                  This Snap enchances the security of the owner by providing Key
                  Rotation Capabilities along with Account Abstraction
                  Capabilites because a smart contract is assigned to the owner
                  of this snap.
                </p>
                <ConnectButton
                  onClick={handleConnectClick}
                  disabled={!state.isFlask}
                />
              </Connect>
            )}
            {shouldDisplayReconnectButton(state.installedSnap) && (
              <Connect>
                <p className="text">Welcome to Safe Rotator</p>
                <p className="text1">
                  This Snap enchances the security of the owner by providing Key
                  Rotation Capabilities along with Account Abstraction
                  Capabilites because a smart contract is assigned to the owner
                  of this snap.
                </p>
                <ConnectButton
                  onClick={handleConnectClick}
                  disabled={!state.isFlask}
                />
              </Connect>
            )}
          </CardContainer>
        </div>
      )}
    </Container>
  );
};

export default Index;
