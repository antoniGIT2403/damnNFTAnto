import React, { useEffect, useState } from 'react';

import AttributesForm from './AttributesForm';
import withAttributesLoading from './withAttributesLoading';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
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


const CustomDan = (state) => {
  const { currentAccount, networkError, setNetworkError, txBeingSent, setTxBeingSent, txSuccess, setTxSuccess, damn, setDamn, hasDamn, damnAttributes, attributeCategory, allAttributes, danList } = state.props;

  const [listDan, setListDan] = useState([
    { name: 'Jean michel', img: 'src/assets/skin/White.png' },
    { name: 'Jean Claude', img: 'src/assets/skin/White.png' },
    { name: 'Jean Francois', img: 'src/assets/skin/White.png' },
    { name: 'Jean Francis', img: 'src/assets/skin/White.png' },
    { name: 'Jean Louis', img: 'src/assets/skin/White.png' },
    { name: 'Jean Francois', img: 'src/assets/skin/White.png' },

  ]);
  const [listDanWithPicture, setListDanWithPicture] = useState([]);
  const [listAttribut, setListAttribut] = useState([
    { name: 'Jean michel', img: 'src/assets/skin/White.png' },
    { name: 'Jean Claude', img: 'src/assets/skin/White.png' },
    { name: 'Jean Francois', img: 'src/assets/skin/White.png' },
    { name: 'Jean Francis', img: 'src/assets/skin/White.png' },
    { name: 'Jean Louis', img: 'src/assets/skin/White.png' },
    { name: 'Jean Francois', img: 'src/assets/skin/White.png' },

  ]);
  const [displayDanChosen, setDisplayDanChosen] = useState(false);
  const [selectedDan, setSelectedDan] = useState({});

  useEffect(() => {
    for (const dan of danList) {
      for (const att of dan.attributes) {
        for (const base of allAttributes.allAttributes) {
          if (att.trait_type === base.category && att.value === base.name) {
            dan.attributes[dan.attributes.indexOf(att)].src = base.image;
            dan.attributes[dan.attributes.indexOf(att)].zindex = base.layer_index;
          }
        }

      }
      setListDanWithPicture(previousDanArray => [...previousDanArray, dan]);
    }


  }, [setListDanWithPicture]);


  const handleDanChosen = (dan) => {
    setDisplayDanChosen(true)
    setSelectedDan(dan)
  };

  const unselectDan = () => {
    setDisplayDanChosen(false)
    setSelectedDan(null)
  };
  const displayAttributes = () => {
    return (listAttribut?.map((dan) =>
      <li>{dan.name}</li>
    ));
  };

  const displayDans = () => {

    //TODO créer une 2eme image avec les attributs selected dynamic
    //TODO affichage conditionnel selon le Zindex
    // trouver un moyen d'afficher la liste des attributes selected
    // fAire une popup lorsqu'on clique sur confirmer
    // refaire une double selection dans le même esprit que le shop attribut
    // débloquer le chop attribut
    return (listDanWithPicture?.map((dan) => (
      <Card variant="outlined" onClick={() => handleDanChosen(dan)} className='mx-5 my-5 relative'>

        {dan.attributes?.map((att, index) => (
          <img key={index} height="150" width="150" className={`absolute ${att.zindex ? "z-" + att.zindex : ""}`} src={att.src} />

        ))}
        {<img height="150" width="150" className="z-10 relative" src={dan.attributes[dan.attributes.length - 1]?.src} />}
        {/* TODO : Trouver une solution plus propre : il faut que la dernière image ai une position relative.. ?? */}

        <p className='text-center'>{dan.name}</p>
      </Card>
    ))
    )
  };

  if (displayDanChosen) {
    return (
      <div className="flex flex-col items-center my-10">
        <button onClick={() => unselectDan()} className="px-3 py-2 rounded-md text-lg font-medium bg-gray-900 text-white btn-cta mx-6  my-3">
          Custom another Dan
        </button>
        <>
          <div className="grid grid-cols-2">
            <div >
              <ul>
                {displayAttributes()}
              </ul>
            </div>
            <div className='mx-5 my-5 relative'>
              {selectedDan.attributes?.map((att, index) => (
                <img key={index} height="300" width="300" className={`absolute ${att.zindex ? "z-" + att.zindex : ""}`} src={att.src} />
              ))}
              <img height="300" width="300" className="z-10 relative" src={selectedDan.attributes[selectedDan.attributes.length - 1]?.src} />
              {/* TODO : Trouver une solution plus propre : il faut que la dernière image ai une position relative.. ?? */}
              <p className='text-center'>{selectedDan.name}</p>
            </div>
          </div>
        </>
        <button onClick={() => unselectDan()} className="px-3 py-2 rounded-md text-lg font-medium bg-gray-900 text-white btn-cta mx-6  my-3">
          Apply those attributes
        </button>
      </div>
    );
  }
  if (!displayDanChosen)
    return (

      <div className="flex flex-col items-center my-10">

        <h1 className="text-4xl sm:text-5xl lg:text-6xl bold mt-4 my-5">Chose You Dan:
        </h1>
        <div className="grid grid-cols-3">
          {displayDans()}
        </div>
        <div className="text-lg p-4 text-center">
          <p className="my-2">Click to custom your Dan with your attributes: </p>

        </div>

      </div>
    );

}

export default CustomDan;
