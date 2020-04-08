import nacl from 'tweetnacl'
nacl.util = require('tweetnacl-util')


// export const decodeKey = key => {
//   return nacl.util.decodeBase64(key)
// }
// export const decodeNonce = nonce => {
//   return nacl.util.decodeBase64(nonce);
// }
// export const decodeMsg = message => {
//   return nacl.util.decodeUTF8(message);
// }

// export nacl.util.encodeBase64()

export const getNewKey = () => {
  return nacl.randomBytes(nacl.secretbox.keyLength)
}
export const getNewNonce = () => {
  return nacl.randomBytes(nacl.secretbox.nonceLength)
}

export const createBox = (msg, nonce, key) => {
  return nacl.util.encodeBase64(nacl.secretbox(nacl.util.decodeUTF8(msg), nacl.util.decodeBase64(nonce), nacl.util.decodeBase64(key)))
}

export const openBox = (msg, nonce, key) => {
  return nacl.util.encodeUTF8(nacl.secretbox.open(nacl.util.decodeBase64(msg), nacl.util.decodeBase64(nonce), nacl.util.decodeBase64(key)))
}

export const getHash = msg => {
  return nacl.util.encodeBase64(nacl.hash(nacl.util.decodeUTF8(msg)))
}