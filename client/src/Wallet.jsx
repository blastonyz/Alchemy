import server from "./server";
import {secp256k1} from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils";



function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {

 


  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);
    
  
    try {
      const address = toHex(secp256k1.getPublicKey(privateKey));
      setAddress(address);
      console.log("Generated address:", address);

      if (address) {
        const response = await server.get(`balance/${address}`);
        const { balance } = response.data;
        setBalance(balance);
        console.log("Fetched balance:", balance);
      } else {
        setBalance(0);
        console.log("Address not found");
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
      setBalance(0);
    }
  }
  return (
    <div className="container wallet">
      <h1 className="wallet-title">Your Wallet
        <img src="./wallet2.svg" alt="" className="wallet-logo"/>
      </h1>

      <label>
        <p className="text">Private Key</p>
        <input placeholder="Type in your Private Key" value={privateKey} onChange={onChange} name="privateKey">
        </input>
      </label>
     
        <div className="balance">
        <h4>Balance: {balance}</h4>
        </div>
        <div className="address">
          <h4>Address: {address} </h4>

        </div>
    
    </div>
  );
}

export default Wallet;

