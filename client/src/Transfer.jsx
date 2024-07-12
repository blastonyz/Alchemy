import { useState } from "react";
import server from "./server";
import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes } from  "ethereum-cryptography/utils";
import { toHex} from "ethereum-cryptography/utils";
import {secp256k1} from "ethereum-cryptography/secp256k1";

function Transfer({ address, setBalance, message, setMessage, privateKey }) {
  const [sendAmount, setSendAmount] = useState("0"); // Inicializar como cadena
  const [recipient, setRecipient] = useState("");
 
  const [messageHex,setMessageHex] = useState("");
  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function hashMessage(message) {
    const messageBytes = utf8ToBytes(message);
    const messageSHA = keccak256(messageBytes);
    return messageSHA;
  }

  async function handleHashMessage(evt) {
    const newMessage = evt.target.value;
    setMessage(newMessage);
    const hashedMessage = await hashMessage(newMessage);
    setMessageHex(toHex(hashedMessage));
  }

  async function signTransaction(messageHash, privateKey) {
    const signature = await secp256k1.sign(messageHash, privateKey);
    return signature;
  }

  async function transfer(evt) {
    evt.preventDefault();
    const messageHash = await hashMessage(message);
 
    if (address.toLowerCase() === recipient.toLowerCase()) {
      alert("can't send found to same address, chooose another");
      return;
  }
  
    try {
      const signature = await signTransaction(messageHash, privateKey);
  
      
      const signatureHex = {
        r: signature.r.toString(16),
        s: signature.s.toString(16),
        recovery: signature.recovery.toString(),
      };
  
      // convert uint8Array(32) to hex, manually
     /* const messageHashHex = Array.prototype.map.call(new Uint8Array(messageHash), x => ('00' + x.toString(16)).slice(-2)).join('');*/
  
      const response = await server.post(`send`, {
        sender: address,
        amount: sendAmount.toString(), 
        recipient,
        hash:messageHex, 
        sign: JSON.stringify(signatureHex), 
      });
  
      const { balance } = response.data;
      setBalance(balance);
    } catch (ex) {
      console.error('Error during transfer:', ex);
      alert('An error occurred while processing your request.');
    }
  }
  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        <p className="text">Send Amount</p>
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
          name="amount"
        ></input>
      </label >
      <label>
        <p className="text">Your Message</p>
        <input placeholder="Type in your Message" value={message} onChange={handleHashMessage} name="message"></input>
      </label>
      <div className="address">Hash: {messageHex}</div>
      <label>
        <p className="text">Recipient</p>
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
          name="recipient"
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
