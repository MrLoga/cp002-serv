"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _cors = _interopRequireDefault(require("cors"));

var _tweetnacl = _interopRequireDefault(require("tweetnacl"));

var _wallet = _interopRequireDefault(require("../models/wallet"));

var _utils = require("../utils");

var _nacl = require("../utils/nacl");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var router = (0, _express.Router)();

var WebSocketClient = require('websocket').client;

var whitelist = ['http://example1.com', 'http://example2.com'];
var corsOptions = {
  origin: function origin(_origin, callback) {
    callback(null, true); // if (whitelist.indexOf(origin) !== -1) {
    //   callback(null, true)
    // } else {
    //   callback(new Error('Not allowed by CORS'))
    // }
  },
  methods: 'POST, GET, OPTIONS, HEAD',
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  credentials: true,
  preflightContinue: true,
  optionsSuccessStatus: 204
};
router.options('*', (0, _cors["default"])(corsOptions));
router.post('/', (0, _cors["default"])(corsOptions), _utils.verifyToken, function (req, res) {
  var appOrigin = req.get('origin');
  console.log('appOrigin = ' + appOrigin);

  if (!appOrigin.length) {
    res.status(406).json({
      code: '406',
      message: 'Not Acceptable'
    });
  }

  var txData = [];

  if (Array.isArray(req.body.data)) {
    txData = req.body.data;
  } else if (_typeof(req.body.data) === 'object') {
    txData.push(req.body.data);
  }

  if (txData.length === 0) {
    res.status(406).json({
      code: '406',
      message: 'Not Acceptable, body is empty'
    });
  }

  console.log(txData); // for (let item of txData) {
  //   if (!item || typeof item !== 'string'){
  //     res.status(406).json({
  //       code: '406',
  //       message: 'Not Acceptable, data error'
  //     })
  //   }
  // }

  _wallet["default"].findById(req.tokenData.w, 'key nonce address login').then(function (walletDoc) {
    var appNonce = 'none';

    if (walletDoc.get('login') && walletDoc.login[appOrigin]) {
      appNonce = walletDoc.login[appOrigin];
    }

    if (appNonce === 'none' || appNonce !== req.tokenData.n) {
      res.cookie('token', 'kek', {
        maxAge: 1,
        httpOnly: true
      });
      return res.status(403).json({
        code: '423',
        message: 'Forbidden'
      });
    } else if (appNonce === 'blocked') {
      res.cookie('token', 'kek', {
        maxAge: 1,
        httpOnly: true
      });
      return res.status(423).json({
        code: '423',
        message: 'Blocked by user'
      });
    } else {
      console.log('payment 1 | ' + appOrigin + ' : ' + appNonce);
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

          if (msg.response[0] && msg.response[0] === null) {
            res.status(500).json({
              code: '500',
              message: 'Undefined error (response return null)'
            });
          } else if (msg.action === 'payment' && msg.from === 'wallet' && typeof msg.response[0] === 'string') {
            if (msg.response[0] === 'reject') {
              res.json({
                code: '200',
                message: 'Reject'
              });
            } else if (typeof msg.response[0] === 'string') {
              res.json({
                code: '200',
                message: 'Resolve',
                hash: msg.response
              });
            }
          } else if (msg.from === 'server' && msg.response[0] === 421) {
            res.status(421).json({
              code: '421',
              message: 'This user is offline or not available'
            });
          } else {
            res.status(418).json({
              code: '418',
              message: 'Undefined error (#418)'
            });
          }
        }); // wsConnect.on('close', (x,y) => {});

        wsConnect.sendUTF(JSON.stringify({
          id: (0, _nacl.getHash)(appOrigin + appNonce),
          url: appOrigin,
          from: 'app',
          action: 'payment',
          to: walletDoc.nonce,
          requests: txData
        }));
      });
      wsClient.connect(process.env.WS_API_URL);
    }
  })["catch"](function (err) {
    console.log('err payment 1 | ' + err);
    res.status(500).send(err);
  });
});
router.get('/', function (req, res) {
  res.json({
    code: '405',
    message: 'Method Not Allowed'
  });
});
var _default = router;
exports["default"] = _default;