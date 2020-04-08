"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _axios = _interopRequireDefault(require("axios"));

var _cors = _interopRequireDefault(require("cors"));

var _currency = _interopRequireDefault(require("../models/currency"));

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var router = (0, _express.Router)();
router.options('*', (0, _cors["default"])(corsOptions));
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
router.get('/', (0, _cors["default"])(corsOptions), (0, _utils.asyncMiddleware)( /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    var currencyData;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _currency["default"].find({}, 'pair value -_id');

          case 2:
            currencyData = _context.sent;
            res.status(200).json(currencyData);

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}()));
router.get('/update', function (req, res) {
  _axios["default"].get('https://currate.ru/api/?get=rates&pairs=USDRUB,USDEUR&key=' + process.env.CURRATE_KEY).then(function (response) {
    var currencyData = response.data.data;
    console.log('/////////////');
    console.log(currencyData);
    console.log('/////////////');
    var currencyTmp = [];

    for (var item in currencyData) {
      currencyTmp.push({
        pair: item,
        value: currencyData[item]
      });
      console.log(item + '.' + currencyData[item]);
    }

    if (currencyTmp.length) {}

    _currency["default"].deleteMany({}).then(function (docs) {
      console.log();

      _currency["default"].create(currencyTmp).then(function (docsCreate) {
        res.status(200).json({
          code: '200',
          message: docsCreate
        });
      })["catch"](function (err) {
        res.status(500).json({
          code: '500',
          message: err
        });
      });
    })["catch"](function (err) {
      res.status(500).json({
        code: '500',
        message: err
      });
    }); // console.log(response.data)
    // res.status(200).json(response.data.data)

  })["catch"](function (err) {
    console.log(err);
    res.status(500).send(err);
  });
});
var _default = router;
exports["default"] = _default;