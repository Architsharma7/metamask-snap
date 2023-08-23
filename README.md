# Safe-Rotator-Snap

A tool to enhance the security of wallets by providing Key Rotation and Account Abstraction capabilities to the Snap.

## Why do users need it ?
The keys, in theory, should be treated the same way as passwords — you are expected to change your password periodically. You may want to perform key rotation if one of the keys in multi-signature scheme is compromised — your funds are still safe, but the protection is weakened.

## What exactly is the Solution then?
We utilised the capabilities of smart contract accounts to enable to creation of a solution for the user to enhance their security by rotating private keys using this smart contract account along with all the capabilities of account abstraction that can be added upon it.
Snap allowed us to do all that by providing an environment for the development of these, which was not possible before.

We integrated Safe Protocol to provider user with a Smart Contract Wallet in Metamask itself , which holds the users funds & the assets , at the same time being able to execute transactions through this safe , and utilising the full Modular benefits of Safe .
The new EOAs are created inside the Safe & secure Snaps environment for the user and they never leave that environment . The Snaps encrypted state is used to Store the Users data to ensure full privacy .
Key Rotation is supposed to happen periodically , every 6 months , to generate a new EOA & Transfer the Ownerships of the Safe to a new account , which changes the private key controlling the assets and safeguarding the funds . Transactions are done gasless through Gelato Relayers with the Safe , so no funds are needed in the EOAs.

## How to use it ?

 ### Running it locally
 
1. Use the ```git clone``` command to clone this project.
2. Go to ```cool-snap/packages``` using the ```cd``` command from your terminal
3. Type ```yarn add``` and once all the dependencies are installed, type ```yarn start``` to run the project.
4. You will be shown the terminal the app is running, for eg. ```localhost:8000```.
   
### Using npm package
   
5. You can also use the snap in your own project by installing the snap from npm with the link below
6. https://www.npmjs.com/package/safe-rotator

## Protocols used to build

Metamask Snap  
Safe Protocol  
Gelato  
Infura API  

## What are the future plans for Safe-Rotator ?

We are planning to fully utilise safe smart contract wallet and Snap to create a more secure and private solution inside the Snap environment, that will be able to perform all the safe methods inside the snap.

## Team
Dhruv Agarwal  
Archit Sharma
