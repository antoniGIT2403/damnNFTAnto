import React, { useEffect, useState } from 'react';

import AttributesForm from './AttributesForm';
import withAttributesLoading from './withAttributesLoading';

import { HomePage } from "./HomePage.jsx";
import { Notification } from "./presentationals/Notification";
import { WaitingForTransactionMessage } from "./presentationals/WaitingForTransactionMessage";

import { ADDR_DAMN, RINKEBY_ID, isDevelopment, ERROR_CODE_TX_REJECTED_BY_USER } from '../../constants';

import damnNft from '../utils/DamnNFT.json';

import { ethers } from "ethers";

const _getRpcErrorMessage = (error) => {
  if (error.data) {
    return error.data.message;
  }
  return error.message;
}

const Attributes = (state) => {

  const { currentAccount, networkError, setNetworkError, txBeingSent, setTxBeingSent, txSuccess, setTxSuccess, damn, setDamn, hasDamn, damnAttributes, attributeCategory, allAttributes } = state.props;

  const Attributes = withAttributesLoading(AttributesForm);

  const addAttribute = async () => {

    try {
      const { ethereum } = window;
      console.log("ici")
      console.log(attributeCategory)


      if (ethereum && hasDamn) {

        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(ADDR_DAMN, damnNft.abi, signer);
        
        var attributeChain = damn.hair + "x" + damn.eyes + "x" + damn.nose + "x" + damn.mouth + "x" + damn.skin;

        console.log("Going to pop wallet now to pay gas...")
        let nftTxn = await connectedContract.addAttributes(damn.id, attributeChain, {
          value: ethers.utils.parseEther("0.033")
        });

        setTxBeingSent(nftTxn.hash);

        console.log("Adding attribute...please wait.")
        await nftTxn.wait();

        // The receipt, contains a status flag, which is 0 to indicate an error.
        if (nftTxn.status === 0) {
          throw new Error("Transaction failed");
        }

        setTxSuccess(nftTxn.hash);

        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);

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
    <div className="flex flex-col ">

      <Attributes isLoading={damnAttributes.loading} attributes={damnAttributes.attributes} damn={damn} setDamn={setDamn} addAttribute={addAttribute} attributeCategory={attributeCategory} allAttributes={allAttributes}  />

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

export default Attributes;
