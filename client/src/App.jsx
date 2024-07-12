import Wallet from "./Wallet";
import Transfer from "./Transfer";
import Header from "./Header"
import AllAccounts from "./AllAccounts";
import { CreateAccount } from "./CreateAccount";
import "./App.scss";
import { useState } from "react";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("") 
  const [message, setMessage] = useState("")

  return (
    <div className="app">
       <Header/>
      <div className="section top-section">
       <div className="body-container">
        <Wallet
          balance={balance}
          setBalance={setBalance}
          address={address}
          setAddress={setAddress}
          privateKey={privateKey}
          setPrivateKey={setPrivateKey}
      
        />
      <Transfer 
        setBalance={setBalance} 
        address={address} 
        message={message}
        setMessage={setMessage}  
        privateKey={privateKey} 
      />
      </div>
      <div className="accounts">
        <div className="create">
          <CreateAccount/>
        </div>
          
        <div className="allaccounts">
            <AllAccounts/>
        </div>
      </div>
      </div>
    </div>
  );
}

export default App;
