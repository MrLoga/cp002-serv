"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var paymentSchema = new _mongoose["default"].Schema({
  address: String,
  requesting: String,
  // Имя сервиса
  // type: String, // bill выставление счета, payment оплата в течении 30 сек
  txArray: [{
    type: String // base64 транзакции

  }],
  // txdata: Buffer, // base64 транзакции
  status: {
    type: String,
    "default": 'pending'
  },
  txHash: [{
    type: String // base64 транзакции

  }],
  created: {
    type: Date,
    "default": Date.now
  }
}); // paymentSchema.statics.findByAddress = async function (address) {
// 	let request = await this.find({
// 		address: address,
// 	});
// 	return request;
// };

paymentSchema.statics.findPendingByNonce = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(address) {
    var request;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return this.find({
              address: address,
              status: 'pending'
            });

          case 2:
            request = _context.sent;
            return _context.abrupt("return", request);

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();

var Payment = _mongoose["default"].model('Payment', paymentSchema);

var _default = Payment;
exports["default"] = _default;