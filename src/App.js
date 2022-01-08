import * as React from "react";
import { useState, useEffect } from "react";
import "./App.css";
import { ethers } from "ethers";
import abi from "../src/utils/wavePortal.json";

export default function App() {
  //Implementation #1

  // const connectWallet = async () => {
  //   if (window.ethereum) { //check if Metamask is installed
  //         try {
  //             const address = await window.ethereum.enable(); //connect Metamask
  //             const obj = {
  //                     connectedStatus: true,
  //                     status: "",
  //                     address: address
  //                 }
  //                 return obj;

  //         } catch (error) {
  //             return {
  //                 connectedStatus: false,
  //                 status: "🦊 Connect to Metamask using the button on the top right."
  //             }
  //         }

  //   } else {
  //         return {
  //             connectedStatus: false,
  //             status: "🦊 You must install Metamask into your browser: https://metamask.io/download.html"
  //         }
  //       }
  // };

  //Implementation #2 (Cleaner)

  const [currentUser, setCurrentUser] = useState("");
  const [currentWaves, setCurrentWaves] = useState(0);

  const initialWaveCount = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contractAddress = "0x4c1c569Ca0344C1066e242F787755bc830F34669";
        const contractABI = abi.abi;
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        let waves = await wavePortalContract.getTotalWaves();
        setCurrentWaves(waves.toNumber());
        console.log("Current Total Waves", currentWaves);
      } else {
        console.log("Ethereum Object not found!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkConnectedWallet = async () => {
    try {
      if (!window.ethereum) {
        console.log("No MetaMask Account Found");
        return;
      } else {
        console.log("Metamask found!", window.ethereum);
      }
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Logged in Account:", account);
        setCurrentUser(account);
      } else {
        console.log("No accounts found!");
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        console.log("No metamask account found!");
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentUser(accounts[0]);
      console.log("Connected", accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const wave = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contractAddress = "0x4c1c569Ca0344C1066e242F787755bc830F34669";
        const contractABI = abi.abi;
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        let waves = await wavePortalContract.getTotalWaves();
        setCurrentWaves(waves.toNumber());
        console.log("Current Total Waves", currentWaves);

        const waveTxn = await wavePortalContract.wave();
        console.log("Mining", waveTxn.hash);
        await waveTxn.wait();
        console.log("Mined", waveTxn.hash);

        waves = await wavePortalContract.getTotalWaves();
        setCurrentWaves(waves.toNumber());
        console.log(currentWaves);
      } else {
        console.log("Ethereum Object not found!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkConnectedWallet();
    initialWaveCount();
  }, []);

  return (
    <div>
      <div className="mainContainer">
        <div className="dataContainer">
          <div className="header">👋 Hey there!</div>

          <div className="bio">
            I am Krish and I work, so that's pretty cool right? Connect your
            Ethereum wallet and wave at me!
          </div>

          <button className="waveButton" onClick={wave}>
            Wave at Me
          </button>

          {!currentUser && (
            <button className="waveButton" onClick={connectWallet}>
              Connect Metamask
            </button>
          )}
        </div>
      </div>
      <div className="mainContainer">
        <div className="smallHeader">Wave Count at: {currentWaves}</div>
      </div>
    </div>
  );
}
