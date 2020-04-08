"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _cors = _interopRequireDefault(require("cors"));

var _axios = _interopRequireDefault(require("axios"));

var _wallet = _interopRequireDefault(require("../models/wallet"));

var _utils = require("../utils");

var _nacl = require("../utils/nacl");

var _tweetnacl = _interopRequireDefault(require("tweetnacl"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_tweetnacl["default"].util = require('tweetnacl-util');
var router = (0, _express.Router)();
var whitelist = ['http://localhost:8080/', 'http://localhost:3000'];
var corsOptions = {
  origin: function origin(_origin, callback) {
    callback(null, true); // if (whitelist.indexOf(origin) !== -1) {
    //   callback(null, true)
    // } else {
    //   callback(new Error('Not allowed by CORS'))
    // }
  },
  // const corsOptions = {
  //   // origin: '*',
  //   // origin: 'https://cp002.na4u.ru/',
  //   origin: process.env.LOCAL_URL,
  methods: 'POST, GET, OPTIONS',
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  preflightContinue: true,
  optionsSuccessStatus: 204
};
var explorerApi = 'https://explorer-api.minter.network/api/v1/';
router.options('*', (0, _cors["default"])(corsOptions));
router.get('/address/:address', (0, _cors["default"])(corsOptions), function (req, res) {
  _wallet["default"].findOne({
    address: req.params.address
  }).then(function (doc) {
    res.send(doc);
  })["catch"](function (err) {
    console.log(err);
    res.status(500).send(err);
  });
});
router.post('/:hash', (0, _cors["default"])(corsOptions), function (req, res) {
  _axios["default"].get("".concat(explorerApi, "transactions/").concat(req.params.hash)).then(function (data) {
    var txData = data.data.data;

    var verifyTextB64 = _tweetnacl["default"].util.encodeUTF8(_tweetnacl["default"].util.decodeBase64(txData.payload));

    var textOpenBox = (0, _nacl.openBox)(verifyTextB64, req.body.userNonceString, req.body.userKeyString);

    if (textOpenBox === 'verify') {
      _wallet["default"].findOne({
        address: txData.from
      }).then(function (walletDoc) {
        if (walletDoc === null) {
          var newWallet = new _wallet["default"]({
            address: txData.from,
            key: req.body.userKeyString,
            nonce: req.body.userNonceString,
            created: new Date()
          });
          newWallet.save().then(function (newSaveDoc) {
            res.send(newSaveDoc);
          });
        } else {
          res.send(walletDoc);
        }
      })["catch"](function (err) {
        console.log(err);
        res.status(500).send(err);
      });
    } else {
      res.status(412).send('Verify FALSE');
    }
  })["catch"](function (error) {
    res.status(error.response.status).send(error.response.statusText);
  });
});
var _default = router; // Если адрес уже есть, то нужно подтверждение чтоб выдать те же ключи и нонс
// Должен доказать что он владелец адреса

exports["default"] = _default;