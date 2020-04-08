"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getHash = exports.openBox = exports.createBox = exports.getNewNonce = exports.getNewKey = void 0;

var _tweetnacl = _interopRequireDefault(require("tweetnacl"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_tweetnacl["default"].util = require('tweetnacl-util'); // export const decodeKey = key => {
//   return nacl.util.decodeBase64(key)
// }
// export const decodeNonce = nonce => {
//   return nacl.util.decodeBase64(nonce);
// }
// export const decodeMsg = message => {
//   return nacl.util.decodeUTF8(message);
// }
// export nacl.util.encodeBase64()

var getNewKey = function getNewKey() {
  return _tweetnacl["default"].randomBytes(_tweetnacl["default"].secretbox.keyLength);
};

exports.getNewKey = getNewKey;

var getNewNonce = function getNewNonce() {
  return _tweetnacl["default"].randomBytes(_tweetnacl["default"].secretbox.nonceLength);
};

exports.getNewNonce = getNewNonce;

var createBox = function createBox(msg, nonce, key) {
  return _tweetnacl["default"].util.encodeBase64(_tweetnacl["default"].secretbox(_tweetnacl["default"].util.decodeUTF8(msg), _tweetnacl["default"].util.decodeBase64(nonce), _tweetnacl["default"].util.decodeBase64(key)));
};

exports.createBox = createBox;

var openBox = function openBox(msg, nonce, key) {
  return _tweetnacl["default"].util.encodeUTF8(_tweetnacl["default"].secretbox.open(_tweetnacl["default"].util.decodeBase64(msg), _tweetnacl["default"].util.decodeBase64(nonce), _tweetnacl["default"].util.decodeBase64(key)));
};

exports.openBox = openBox;

var getHash = function getHash(msg) {
  return _tweetnacl["default"].util.encodeBase64(_tweetnacl["default"].hash(_tweetnacl["default"].util.decodeUTF8(msg)));
};

exports.getHash = getHash;