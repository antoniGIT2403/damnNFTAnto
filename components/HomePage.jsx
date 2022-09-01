import React from "react";

import { TOTAL_MINT_COUNT } from '../../constants.jsx';
import { Notification } from "./presentationals/Notification";

export function HomePage({ networkError, dismiss, currentAccount, hasDamn, damn }) {

  function displayConnected() {
     
    if (hasDamn) {
      console.log(damn);
      return (
        <div className="text-lg p-4 text-center ">
          <div className="mt-10 md:mt-1 p-2 px-6 rounded text-center text-white ">
            <p >You are the proud owner of {hasDamn ? "a damn" : "" }</p>
            {/* { damn.loading ? <div /> : <img src={damn.image_url} loading="lazy" alt="" />} */}
            {<img src="src/assets/logo.png" loading="lazy" alt="" /> }
            <div className="text-lg p-4 text-center">
            {/* <p className="my-8">So what you want to do now ?</p> */}
        <button  className="px-3 py-2 rounded-md text-lg font-medium bg-gray-900 text-white btn-cta mx-6  my-3">
           Customize your Dan
        </button>
        {/* <button  className="px-3 py-2 rounded-md text-lg font-medium bg-gray-900 text-white btn-cta">
            Kill your Dan
        </button> */}
      </div>
          </div>
        </div>
      )
    } 

    return ("You have no damn")
  }

  function displayNotConnected() {
    return (
      <div className="text-lg p-4 text-center">
      <p className="text-2xl sm:text-3xl lg:text-4xl bold mt-4">Please connect to your wallet 
          </p>
      </div>
    )
  }

  return (
    <div className="bg-black text-white my-12">
      <div className="flex flex-col items-center">
        <div className="text-center">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl bold mt-4  my-8"> Welcome to hell
          </h1>
          <h3 className="text-4xl sm:text-5xl lg:text-6xl bold mt-4">{TOTAL_MINT_COUNT} Damn
          </h3>
          <div>to mint for free</div>
        </div>
        
        { currentAccount ? displayConnected() : displayNotConnected() }

      </div>

      { networkError && (<Notification message={networkError} dismiss={dismiss}/>) }

    </div>
  );
}
