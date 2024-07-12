const express = require("express");
const {secp256k1} = require("ethereum-cryptography/secp256k1.js")
const { hexToBytes } = require("ethereum-cryptography/utils")
const app = express();
const cors = require("cors");
const port = 3042;
const { generateKeys } = require("./scripts/generate.js");

app.use(cors());
app.use(express.json());

const allPrivatesKeys = [
  { 
    private1:"90d427b1ddb35197eeb18764774c77ecd1e0e78943a45b3a7ddb06618c4c7f8f",
    public1:"037b9597b44cb8ea4e81494f73f2bf24c75174b445fddd75fd053020d0db882186",
    owner:"Dan"
  },
  { 
    private2:"03681b060918bbfe3b8e66d931d719c9dff08cd1511bf9ff793d1dcb3a163fa9",
    public2:"03099f4f34af8b27103911fbb0865f604956a21a15c9d37ffc7f694177e0915932",
    owner:"John"
  },
  { 
    private3:"6f086d56e04535fe168dff667193b75bad0f64670a625b98276a59411f647e92",
    public3:"03c17ada1c2db8c1a52aa0c972c747a76a146c2015ba8b21b74d23f70db8a791ea",
    owner:"Ana"
  },
]

const balances = {
  "037b9597b44cb8ea4e81494f73f2bf24c75174b445fddd75fd053020d0db882186": 100,
  "030aedc19e6d88aba039be8ee21410fc718b22a241485be106075e600424007ecf": 50,
  "03c17ada1c2db8c1a52aa0c972c747a76a146c2015ba8b21b74d23f70db8a791ea": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, hash, sign } = req.body;

  console.log("Request body:", req.body);
  if( sender !== recipient){
  const hashBytes = hexToBytes(hash);

  const signObj = JSON.parse(sign);
  const r = BigInt(`0x${signObj.r}`);
  const s = BigInt(`0x${signObj.s}`);
  const recovery = parseInt(signObj.recovery, 10);

  try {
    // Verify signature
    const isSigned = secp256k1.verify({ r, s, recovery },hashBytes,sender);

    if (isSigned) {
      if (balances[sender] < amount) {
        res.status(400).send({ message: "Not enough funds!" });
      } else {
        balances[sender] -= amount;
        balances[recipient] += parseInt(amount);
        res.send({ balance: balances[sender] });
        console.log("transfer succesfull");
      }
    } else {
      res.status(400).send({ message: "Signature verification failed!" });
    }
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
  }else{
    res.status(400).send({message: "Recipient and sender must be differents addresses"})
  }  
});

app.put("/create", (req,res) =>{
    const {owner,balance} = req.body;
    console.log('body',req.body)
    const keys = generateKeys();
    const newAddress = keys.publicKeyHex;
    balances[newAddress] = parseInt(balance);
    const newKeyIndex = allPrivatesKeys.length + 1;
    const newUser = {
      [`private${newKeyIndex}`]: keys.privateKeyHex,
      [`public${newKeyIndex}`]: keys.publicKeyHex,
      owner: owner
    };

    allPrivatesKeys.push(newUser);
    res.send({keys,balances})
})

app.get("/allaccounts", (req,res)=> {
  res.status(200).send(allPrivatesKeys)
})


app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
