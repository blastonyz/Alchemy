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
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input placeholder="Type in your Private Key" value={privateKey} onChange={onChange}></input>
      </label>
     
      <div className="balance">Balance: {balance}</div>
      <div className="address">Address: {address}</div>
    
    </div>
  );
}

export default Wallet;


/*    try {
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
  }*/

    /*  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);
    const address = toHex(secp256k1.getPublicKey(privateKey));
    setAddress(address);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
      console.log("balance ",balance)
    } else {
      setBalance(0);
      console.log("not found")
    }
  }*/