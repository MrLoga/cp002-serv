"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var currencySchema = new _mongoose["default"].Schema({
  pair: {
    type: String
  },
  value: {
    type: String
  }
});

var Currency = _mongoose["default"].model('Currency', currencySchema);

var _default = Currency;
exports["default"] = _default;