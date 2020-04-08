"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _payment = _interopRequireDefault(require("../models/payment"));

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var router = (0, _express.Router)();

var WebSocketClient = require('websocket').client;

router.post('/:address', _utils.verifyToken, (0, _utils.asyncMiddleware)( /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    var appOrigin, request, wsPaymentClient;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // if (req.headers.host != req.headers.origin) return res.send("Hi");
            // var origin = req.get('origin');
            // var host = req.get('host')
            console.log(req.tokenData);
            appOrigin = req.get('origin');
            _context.prev = 2;
            _context.next = 5;
            return _payment["default"].create({
              address: req.params.address,
              requesting: appOrigin,
              txArray: req.body.data
            });

          case 5:
            request = _context.sent;
            _context.next = 12;
            break;

          case 8:
            _context.prev = 8;
            _context.t0 = _context["catch"](2);
            console.log("payment.js routes error");
            console.log(_context.t0);

          case 12:
            console.log(request);
            wsPaymentClient = new WebSocketClient();
            wsPaymentClient.on('connect', function (wsConnect) {
              var timerId = setTimeout(function () {
                wsConnect.close();

                _payment["default"].findByIdAndUpdate({
                  _id: request._id
                }, {
                  $set: {
                    "status": "timeout"
                  }
                }, {
                  "new": true,
                  select: "address status -_id"
                }).then(function (updateDoc) {
                  console.log('timeout');
                  res.status(408).send(updateDoc);
                })["catch"](function (err) {
                  console.log(err);
                  res.status(500).send(err);
                });
              }, 60 * 1000);
              wsConnect.on('message', function (messageRaw) {
                var msg = JSON.parse(messageRaw.utf8Data);

                if (msg.from == 'wallet' && msg.response[0] === "reject") {
                  clearTimeout(timerId);
                  wsConnect.close();
                  console.log('reject');
                  res.send(messageRaw.utf8Data);
                } else if (msg.from == "user" && msg.response[0] === "resolve") {
                  clearTimeout(timerId);
                  wsConnect.close();
                  console.log('resolve');
                  res.status(500).send(messageRaw.utf8Data);
                }
              }); // wsConnect.on('close', (x,y) => {});

              wsConnect.sendUTF(JSON.stringify({
                from: 'app',
                action: 'payment',
                to: request.address,
                requests: [request]
              }));
            });
            wsPaymentClient.connect(process.env.WS_API_URL + '/payment');

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[2, 8]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}()));
router.get('/clear', (0, _utils.asyncMiddleware)( /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
    var requests;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            console.log("drop");
            _context2.next = 3;
            return _payment["default"].deleteMany({});

          case 3:
            requests = _context2.sent;
            return _context2.abrupt("return", res.send(requests));

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}()));
router.get('/:address', (0, _utils.asyncMiddleware)( /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res) {
    var requests;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return _payment["default"].findByAddress(req.params.address);

          case 2:
            requests = _context3.sent;
            return _context3.abrupt("return", res.send(requests));

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}()));
router.post('/bill/:address', (0, _utils.asyncMiddleware)( /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res) {
    var request;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return _payment["default"].create({
              address: req.params.address,
              type: "bill",
              b64tx: req.body.b64tx,
              requesting: req.headers.origin
            });

          case 2:
            request = _context4.sent;
            return _context4.abrupt("return", res.send(request));

          case 4:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function (_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}())); // router.get('/save/:address/', asyncMiddleware(async (req, res) => {
//  const push = await Payment.create({
//    _id: req.params.address,
//    pub: "123",
//  });
//  return res.send(push);
// }));
// router.delete('/:address', asyncMiddleware(async (req, res) => {
//  const push = await Payment.find(req.params.address);
//  let result = null;
//  if(push){
//    result = await push.deleteOne();
//  }
//  return res.send(result);
// }));

router.put('/', function (req, res) {
  return res.send('Received a PUT HTTP method');
});
var _default = router;
exports["default"] = _default;