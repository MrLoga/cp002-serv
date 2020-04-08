"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _axios = _interopRequireDefault(require("axios"));

var _wallet = _interopRequireDefault(require("../models/wallet"));

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = (0, _express.Router)();

var WebSocketClient = require('websocket').client;

router.get('/address/:address', function (req, res) {
  _wallet["default"].find({
    address: req.params.address
  }).then(function (data) {
    console.log(data);
    res.json({
      wallet: data
    });
  })["catch"](function (err) {
    console.log(err);
    res.status(500).send(err);
  });
});
router.get('/ws', function (req, res) {
  var wsClient = new WebSocketClient();
  wsClient.on('connect', function (wsConnect) {
    var timerId = setTimeout(function () {
      wsConnect.close();
      res.status(408).send(JSON.stringify({
        code: '408',
        message: 'Request Timeout'
      }));
    }, 60 * 1000);
    wsConnect.on('message', function (messageRaw) {
      var msg = JSON.parse(messageRaw.utf8Data);
      clearTimeout(timerId);
      wsConnect.close();
      res.json({
        ws: msg.response
      });
    });
    wsConnect.sendUTF(JSON.stringify({
      from: 'server',
      action: 'status'
    }));
  });
  wsClient.connect(process.env.WS_API_URL);
});
router.get('/', function (req, res) {
  _wallet["default"].count({}).then(function (data) {
    res.json({
      wallets: data
    });
  })["catch"](function (err) {
    console.log(err);
    res.status(500).send(err);
  });
});
router.get('/clear', function (req, res) {
  console.log("drop all Wallet");

  var requests = _wallet["default"].deleteMany({}).then(function (data) {
    res.send(data);
  });
});
var _default = router;
exports["default"] = _default;