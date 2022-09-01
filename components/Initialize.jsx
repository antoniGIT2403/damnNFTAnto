import { ethers } from "ethers";

import damnNft from '../utils/DamnNFT.json';

import { ADDR_DAMN, OPENSEA_API, RINKEBY_ID, isDevelopment } from '../../constants';

const initialize = async (stateManagement) => {
  const { setCurrentAccount, setNetworkError, resetState } = stateManagement;

  try {

    const [selectedAddress] = await window.ethereum.request({ method: 'eth_requestAccounts' });

    if (window.ethereum.networkVersion !== RINKEBY_ID && isDevelopment === false) {
      setNetworkError("Please connect Metamask to Rinkeby network")

      return;
    }

    _initialize(selectedAddress, stateManagement);

    window.ethereum.on("accountsChanged", ([newAddress]) => {
      // `accountsChanged` event can be triggered with an undefined newAddress.
      // This happens when the user removes the Dapp from the "Connected
      // list of sites allowed access to your addresses" (Metamask > Settings > Connections)
      // To avoid errors, we reset the dapp state 
      if (newAddress === undefined) {
        return resetState();
      }
      
      _initialize(newAddress, stateManagement);
    });
    
    // We reset the dapp state if the network is changed
    window.ethereum.on("chainChanged", ([networkId]) => {
      resetState();
    });

    setCurrentAccount(selectedAddress);

  } catch (error) {
    console.log(error);
  }
}


const _initialize = (selectedAddress, stateManagement) => {
  const { setCurrentAccount } = stateManagement;

  setCurrentAccount(selectedAddress);

  _intializeEthers(selectedAddress, stateManagement);
}

const _intializeEthers = async (selectedAddress, stateManagement) => {
  const { setDamn, setHasDamn } = stateManagement;
  try {

    // We initialize ethers by creating a provider using window.ethereum
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const theDamnContract = new ethers.Contract(ADDR_DAMN, damnNft.abi, signer);

    const balanceDamn = await theDamnContract.balanceOf(selectedAddress);

    if (balanceDamn > 0) {
      setHasDamn(true);

      setDamn({ loading: true });
      fetch(OPENSEA_API + '/assets?owner='+ selectedAddress + '&asset_contract_address='+ ADDR_DAMN)
        .then((res) => res.json())
        .then((res) => {
          
          setDamn({ 
            loading: false, 
            id: res.assets[0].token_id, 
            image_url: res.assets[0].image_url,
            hair: res.assets[0].traits.length > 0 ? res.assets[0].traits.filter(trait => trait.trait_type === 'Hair')[0].value : null,
            eyes: res.assets[0].traits.length > 0 ? res.assets[0].traits.filter(trait => trait.trait_type === 'Eye')[0].value : null,
            nose: res.assets[0].traits.length > 0 ? res.assets[0].traits.filter(trait => trait.trait_type === 'Nose')[0].value : null,
            mouth: res.assets[0].traits.length > 0 ? res.assets[0].traits.filter(trait => trait.trait_type === 'Mouth')[0].value : null,
            skin: res.assets[0].traits.length > 0 ? res.assets[0].traits.filter(trait => trait.trait_type === 'Head')[0].value : null
          });
        });
    }
  } catch(error) {
    console.log(error);
  }
}

export default initialize;