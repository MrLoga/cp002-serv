"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _wallet = _interopRequireDefault(require("../models/wallet"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function findByAddress(address) {
  return Payment.findPendingByAddress(address);
} // async function findPendingByNonce(address) {
// 	return await ;
// }


var wsDB = new Map(); // Хранятся пары ключ значения

function _default(ws, req) {
  ws.on('message', function (messageRaw) {
    var msg = false;

    try {
      msg = JSON.parse(messageRaw);
    } catch (e) {
      ws.send(JSON.stringify(errors['400']));
    }

    if (msg.from === 'server') {
      switch (msg.action) {
        case 'status':
          ws.send(JSON.stringify({
            from: 'server',
            action: 'status',
            date: new Date(),
            response: _toConsumableArray(wsDB.keys())
          }));
          break;
      }
    } else if (msg.from === 'wallet') {
      switch (msg.action) {
        case 'connect':
          ws.customClientId = msg.id;
          wsDB.set(msg.id, ws); // let keys = [ ...wsDB.keys() ]
          // console.log(keys)

          _wallet["default"].findOne({
            nonce: msg.id
          }, 'login').then(function (walletDoc) {
            ws.send(JSON.stringify({
              from: 'server',
              action: 'connect',
              date: new Date(),
              response: [walletDoc.login]
            }));
          }); // Payment.findPendingByNonce(msg.id).then(requests => {
          // })


          break;

        case 'login':
          wsDB.get(msg.to).send(messageRaw);
          break;

        case 'payment':
          wsDB.get(msg.to).send(messageRaw);
          break;

        case 'remove-auth':
          _wallet["default"].findOne({
            nonce: msg.id
          }, 'login').then(function (walletDoc) {
            console.log(walletDoc);
            delete walletDoc.login[msg.requests[0]];
            walletDoc.markModified('login');
            walletDoc.save().then(function (walletSave) {
              ws.send(JSON.stringify({
                from: 'server',
                action: 'remove-auth',
                response: [walletSave.login]
              }));
            })["catch"](function (err) {
              console.log(err);
            });
          });

          break;

        default:
          // Либо отдаём 404
          ws.send(JSON.stringify(errors['404']));
          break;
      }
    } else if (msg.from === 'app') {
      ws.customClientId = msg.id;
      wsDB.set(msg.id, ws);

      if (wsDB.has(msg.to) && wsDB.get(msg.to) !== undefined) {
        msg.date = new Date();
        wsDB.get(msg.to).send(JSON.stringify(msg));
      } else {
        ws.send(JSON.stringify({
          from: 'server',
          action: msg.action,
          date: new Date(),
          response: [421]
        }));
      }
    }
  });
  ws.on('close', function (data) {
    console.log("delete", ws.customClientId);
    wsDB["delete"](ws.customClientId);
  });
}

;