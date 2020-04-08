"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _payment = _interopRequireDefault(require("./payment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// import Push from './push';
// import Message from './message';
_mongoose["default"].set('useFindAndModify', true);

var models = {
  Payment: _payment["default"]
}; // const models = { Push, Message };

var _default = models;
exports["default"] = _default;