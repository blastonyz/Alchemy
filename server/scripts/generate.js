const {secp256k1} = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");

const generateKeys = () => {
   
        const genPrivateKey = secp256k1.utils.randomPrivateKey();
        const publicKey = secp256k1.getPublicKey(genPrivateKey);
        const privateKeyHex = toHex(genPrivateKey);
        const publicKeyHex = toHex(publicKey)
        return ({privateKeyHex,publicKeyHex})
}

module.exports = {generateKeys}