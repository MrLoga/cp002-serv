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
var cookieOptions = {
  maxAge: 30 * 24 * 60 * 60 * 1000,
  // 30 day
  httpOnly: true
};
router.options('*', (0, _cors["default"])(corsOptions));
router.post('/', (0, _cors["default"])(corsOptions), function (req, res) {
  var appOrigin = req.get('origin');

  if (!appOrigin.length) {
    res.status(400).json({
      code: '400',
      message: 'Bad Request'
    });
  }

  _wallet["default"].findOne({
    address: req.body.address
  }, 'key nonce address login').then(function (walletDoc) {
    if (!walletDoc) {
      return res.status(404).json({
        code: '404',
        message: 'Address not found'
      });
    }

    var loginNonce = '';

    if (!walletDoc.get('login')) {
      walletDoc.login = {};
    }

    if (walletDoc.get('login') && walletDoc.login[appOrigin]) {
      loginNonce = walletDoc.login[appOrigin];
    }

    if (loginNonce === 'blocked') {
      return res.status(423).json({
        code: '423',
        message: 'Blocked by user'
      });
    } else {
      console.log('login 1 | ' + appOrigin + ' : ' + loginNonce);
      var wsClient = new WebSocketClient();
      wsClient.on('connect', function (wsConnect) {
        var timerId = setTimeout(function () {
          wsConnect.close();
          res.status(408).json({
            code: '408',
            message: 'Request Timeout'
          });
        }, 60 * 1000);
        wsConnect.on('message', function (messageRaw) {
          var msg = JSON.parse(messageRaw.utf8Data);
          clearTimeout(timerId);
          wsConnect.close();
          console.log('login 2 | ' + msg);
          console.log(msg);
          console.log('-- // login 2 | ' + msg);

          if (msg.response[0] && msg.response[0] === null) {
            res.status(500).json({
              code: '500',
              message: 'Undefined error (response return null)'
            });
          } else if (msg.action === 'login' && msg.from === 'wallet' && typeof msg.response[0] === 'string') {
            if (msg.response[0] === 'reject') {
              res.cookie('cp002', 'reject');
              res.json({
                code: '401',
                message: 'Wallet rejected'
              });
            } else if (msg.response[0] === 'blocked') {
              walletDoc.login[appOrigin] = 'blocked';
              walletDoc.markModified('login');
              walletDoc.save().then(function (walletSave) {
                res.cookie('cp002', 'blocked');
                res.status(423).json({
                  code: '423',
                  message: 'Blocked by wallet'
                });
              })["catch"](function (err) {
                console.log('login err 1 | ' + err);
                res.status(500).send(err);
              });
            } else {
              walletDoc.login[appOrigin] = msg.response[0]; // console.log(walletDoc.login)

              walletDoc.markModified('login');
              walletDoc.save().then(function (walletSave) {
                // const walletSecret = createBox(msg.response[0], process.env.NACL_NONCE, process.env.NACL_SECRET) // app nonce
                _jsonwebtoken["default"].sign({
                  w: walletDoc._id,
                  n: msg.response[0],
                  // app nonce
                  aud: appOrigin
                }, process.env.NACL_SECRET, {
                  expiresIn: '7d'
                }, function (err, token) {
                  res.cookie('token', token, cookieOptions);
                  res.cookie('cp002', true, {
                    maxAge: 7 * 24 * 60 * 60 * 1000
                  });
                  res.json({
                    code: '200',
                    message: 'Access granted'
                  });
                });
              })["catch"](function (err) {
                console.log('login err 2 | ' + err);
                res.status(500).send(err);
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
          id: (0, _nacl.getHash)(appOrigin + req.params.address),
          url: appOrigin,
          from: 'app',
          action: 'login',
          to: walletDoc.nonce,
          requests: [appOrigin]
        }));
      });
      wsClient.connect(process.env.WS_API_URL);
    }
  })["catch"](function (err) {
    console.log('login err 3 | ' + err);
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