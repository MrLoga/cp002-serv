"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var WalletSchema = new _mongoose["default"].Schema({
  address: {
    type: String,
    index: true,
    unique: true
  },
  nonce: {
    type: String // index: true,
    // unique: true

  },
  key: String,
  login: {
    type: _mongoose["default"].Schema.Types.Mixed,
    "default": {}
  },
  project: {
    type: Boolean,
    "default": false
  },
  telegram: String,
  name: String,
  created: {
    type: Date
  }
}, {
  minimize: false
});

var Wallet = _mongoose["default"].model('Wallet', WalletSchema);

var _default = Wallet;
exports["default"] = _default;