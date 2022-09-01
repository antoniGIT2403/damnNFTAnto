import twitterLogo from './assets/twitter-logo.svg';
import discordLogo from './assets/discord-logo.svg';
import { ethers } from "ethers";
import initialize from './components/Initialize.jsx';
import React, { useEffect, useState } from "react";
import { Outlet, Routes, Route } from 'react-router-dom';

import { HomePage } from './components/HomePage.jsx';
import { NavBar } from './components/presentationals/NavBar.jsx';
import Mint from './components/Mint.jsx';
import Attributes from './components/Attributes.jsx';
import CustomDan from './components/CustomDan.jsx';
import damnNft from './utils/DamnNFT.json';
import { API_URL, TWITTER_LINK,DISCORD_LINK,ADDR_DAMN ,ERROR_CODE_TX_REJECTED_BY_USER} from '../constants.jsx';

const App = () => {

  const [ currentAccount, setCurrentAccount] = useState(undefined);

  const [ hasDamn, setHasDamn ] = useState(false);
  const [ danList, setDanList ] = useState
    ([])

  const [ damn, setDamn ] = useState
  ({
    loading: false,
    id: null,
    image_url: null,
    /*0*/ hair: null,
    /*1*/ eyes: null,
    /*2*/ nose: null,
    /*3*/ mouth: null,
    /*4*/ skin: null
  })

  const [ txBeingSent, setTxBeingSent ] = useState(undefined);
  const [ txSuccess, setTxSuccess ] = useState(undefined);
  const [ networkError, setNetworkError ] = useState(undefined);
  
  // List of available damn attributes
  const [ damnAttributes, setDamnAttributes] = useState({
    loading: false,
    attributes: null,
  });

  
  const [ allAttributes, setAllAttributes] = useState({
    allAttributes : null
   });
 
    const [ attributeCategory, setAttributeCategory] = useState({
     categories : null
    });
  
  const resetState = () => {
		setCurrentAccount(undefined)
		setHasDamn(false)
    setTxBeingSent(undefined)
		setNetworkError(undefined)
	}

  /*
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    initialize({
			setCurrentAccount,
      setDamn,
			setHasDamn,
			resetState
		})
  }

  const askContractToMintNft = async () => {



      try {
        const { ethereum } = window;
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = await provider.getSigner();
          const connectedContract = new ethers.Contract(ADDR_DAMN, damnNft.abi, signer);
          // console.log("Going to pop wallet now to pay gas...")
          let myAdress = await signer.getAddress();
          let tokensOfOwner = await connectedContract.tokensOfOwner(myAdress)
          for (const token of tokensOfOwner) {
            let tokenURI = await connectedContract.tokenURI(token);
            let splitedUrl = tokenURI.split(/[//]/)
            fetch(" https://ipfs.io/ipfs/" + splitedUrl[2])
              .then((res) => res.json())
              .then((newDan) => {
                console.log(newDan);
                setDanList(previousDanArray => [...previousDanArray, newDan]);
              });
          }
          setTxBeingSent(tokensOfOwner.hash);

          // console.log("Mining...please wait.")
          await tokensOfOwner.wait();
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
  

    useEffect(() => {
      askContractToMintNft();
      connectWallet();
      setDamnAttributes({ loading: true });
  
      fetch(API_URL + '/attributes')
        .then((res) => res.json())
        .then((attributes) => {
          console.log(attributes);
          setDamnAttributes({ loading: false, attributes: attributes });
          console.log(damnAttributes);
        });
        fetch('https://danz-back.herokuapp.com/api/bases/')  //TODO : TRANSFORMER SOUR LA FORME URL + API 
        .then((res) => res.json())
        .then((allAttributes) => {
          setAllAttributes({ allAttributes: allAttributes })
        });
      fetch('https://danz-back.herokuapp.com/api/categories/')  //TODO : TRANSFORMER SOUR LA FORME URL + API 
        .then((res) => res.json())
        .then((categories) => {
          setAttributeCategory({ categories: categories })
        });
    }, [setDamnAttributes, setAttributeCategory, setAllAttributes]);

  const Layout = () => {
    return (
      <div className="flex flex-col min-h-screen bg-black text-white min-h-screen">
        <NavBar
          connectWallet={connectWallet}
          currentAccount={currentAccount}
        />
        <Outlet />
        <div className="flex-1"></div>
        <footer className="footer-container">
          <div>
            <img src="/src/assets/flame.gif" loading="lazy" alt="" />
          </div>

          <div>
            <a href={TWITTER_LINK} target="_blank">
              <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
            </a>
          </div>

          <div>
            <a href={DISCORD_LINK} target="_blank">
              <img alt="Discord Logo" className="twitter-logo" src={discordLogo} />
            </a>
          </div>
          <div>
            <img src="/src/assets/flame.gif" loading="lazy" alt="" />
          </div>
        </footer>
      </div>
    );
  }

  return (
    <Routes>
      <Route element={<Layout />}>

        <Route
          path="/"
          element={
            <HomePage
              networkError={networkError}
              dismiss={() => setNetworkError(undefined)}
              currentAccount={currentAccount}
              hasDamn={hasDamn}
              damn={damn}
            />
          }
        />

        <Route
          path="mint"
          element={
            <Mint props={{
              currentAccount, hasDamn, networkError, setNetworkError,
              txBeingSent, setTxBeingSent, txSuccess, setTxSuccess
            }} />
          }
        />

        <Route
          path="attributes"
          element={
            <Attributes props={{
              currentAccount, hasDamn, networkError, setNetworkError,
              txBeingSent, setTxBeingSent, txSuccess, setTxSuccess,
              damn, setDamn,
              damnAttributes, attributeCategory, allAttributes
            }} />
          }
        />
        <Route
          path="customDan"
          element={
            <CustomDan props={{
              currentAccount, hasDamn, networkError, setNetworkError,
              txBeingSent, setTxBeingSent, txSuccess, setTxSuccess,
              damn, setDamn,
              damnAttributes, attributeCategory, allAttributes, danList
            }} />
          }
        />

        <Route
          path="*"
          element={
            <main className="bg-black text-white overflow-scroll">
              <p className="text-3xl semibold mt-20 text-center">There's nothing here!</p>
            </main>
          }
        />
      </Route>
    </Routes>
  );
};

export default App;