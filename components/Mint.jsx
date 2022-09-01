import React from "react";

import { ethers } from "ethers";

import { HomePage } from "./HomePage.jsx";
import { Notification } from "./presentationals/Notification";
import { WaitingForTransactionMessage } from "./presentationals/WaitingForTransactionMessage";

import { ADDR_DAMN, RINKEBY_ID, isDevelopment, ERROR_CODE_TX_REJECTED_BY_USER } from '../../constants';

import damnNft from '../utils/DamnNFT.json';

import { NavLink } from "react-router-dom";

const _getRpcErrorMessage = (error) => {
  if (error.data) {
    return error.data.message;
  }
  return error.message;
}

const Mint = (state) => {

  const { currentAccount, networkError, setNetworkError, txBeingSent, setTxBeingSent, txSuccess, setTxSuccess } = state.props;

  const askContractToMintNft = async () => {

      try {
        const { ethereum } = window;

        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = await provider.getSigner();
          const connectedContract = new ethers.Contract(ADDR_DAMN, damnNft.abi, signer);

          console.log("Going to pop wallet now to pay gas...")
          // let baseURI2 = await connectedContract.baseURI;
          // let baseURI = await connectedContract.baseURI(ADDR_DAMN);
          // let tokenURI = await connectedContract.tokenURI;
         
          // let byteCode = await signer.provider.getCode(ADDR_DAMN)

          let myAdress = await signer.getAddress();
          let tokensOfOwner = await connectedContract.tokensOfOwner(myAdress)
          for (const token of tokensOfOwner) {
            let tokenURI = await connectedContract.tokenURI(token);
             console.log(tokenURI);
            //  https://ipfs.io/ipfs/QmPQJe15mP5F53dpZm3JRChoyCtNGrjfTsYJweDpE2dmjG
            //  "ipfs://QmPQJe15mP5F53dpZm3JRChoyCtNGrjfTsYJweDpE2dmjG"
            let splited =  tokenURI.split(/[//]/)
            console.log(splited[2])
            fetch(" https://ipfs.io/ipfs/" + splited[2])
            .then((res) => res.json())
            .then((ipfs) => {
              console.log(ipfs);
              
            });
          }
          setTxBeingSent(tokensOfOwner.hash);

          console.log("Mining...please wait.")
          await tokensOfOwner.wait();
          
          // The receipt, contains a status flag, which is 0 to indicate an error.
          if (tokensOfOwner.status === 0) {
            throw new Error("Transaction failed");
          }

          setTxSuccess(tokensOfOwner.hash);

          console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${tokensOfOwner.hash}`);

        } else {
          console.log("Ethereum object doesn't exist!");
        }
      } catch (error) {
        if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
          return;
        }

        setNetworkError(_getRpcErrorMessage(error));
        console.log(error)
      } finally {
        // If we leave the try/catch, we aren't sending a tx anymore, so we clear
        // this part of the state.
        setTxBeingSent(undefined);
      }
  }

  if (currentAccount === undefined) {
    return <HomePage
      networkError={networkError}
      dismiss={() => setNetworkError(undefined)}
      currentAccount={currentAccount}
    />
  }

  return (
    <div className="flex flex-col items-center my-20">
      
      <h1 className="text-5xl sm:text-6xl lg:text-7xl bold mt-4">999 Damn
      </h1>
      <div>to mint for free</div>
      
      <div className="text-lg p-4 text-center">
      <p className="my-2">Click here to mint your Dan and get your NFT: </p>
        <button onClick={askContractToMintNft} className="px-4 py-3 rounded-md text-lg font-semibold bg-gray-900 text-white btn-cta my-10 text-2xl">
            Mint your Dan
        </button>
      </div>
      {txBeingSent && (
        <WaitingForTransactionMessage
          message={txBeingSent}
        />
      )}

      {(networkError || txSuccess) && (
        <Notification
          message={networkError || txSuccess}
          dismiss={() => {
            if (networkError) setNetworkError(undefined)
            else setTxSuccess(undefined)
          }}
          isTxSuccess={txSuccess}
        />
      )}
    </div>
  );
}

export default Mint;
