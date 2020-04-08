"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verifyToken = exports.asyncMiddleware = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// import { openBox } from '../utils/nacl'
var asyncMiddleware = function asyncMiddleware(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next))["catch"](next);
  };
};

exports.asyncMiddleware = asyncMiddleware;
var cookieDel = {
  maxAge: 1,
  httpOnly: true
}; // Cookie: token <access_token>
// Authorization: Bearer <access_token>

var verifyToken = function verifyToken(req, res, next) {
  var bearerCookie = req.cookies.token;
  var bearerHeader = req.headers['authorization'];

  if (typeof bearerHeader !== 'undefined') {
    bearerHeader = bearerHeader.split(' ')[1];
  }

  var jwtToken = bearerCookie || bearerHeader;

  if (typeof jwtToken !== 'undefined') {
    // const bearerToken = token.split(' ')[1]
    // req.token = bearerToken;
    var appOrigin = req.get('origin');

    _jsonwebtoken["default"].verify(jwtToken, process.env.NACL_SECRET, function (err, tokenData) {
      if (err) {
        res.cookie('token', 'kek', cookieDel);
        res.cookie('cp002', false);
        console.log('utils 1');
        res.status(423).json({
          code: '423',
          message: 'Token error: ' + err.name
        });
      } else {
        // let boxMsg = openBox(tokenData.d, process.env.NACL_NONCE, process.env.NACL_SECRET)
        // tokenData.keys = {
        //   key: boxMsg.split(' ')[0],
        //   nonce: boxMsg.split(' ')[1]
        // }
        if (appOrigin !== tokenData.aud) {
          res.cookie('token', 'kek', cookieDel);
          res.cookie('cp002', false);
          console.log('utils 2');
          res.status(423).json({
            code: '423',
            message: 'Token error'
          });
        }

        req.tokenData = tokenData;
        next();
      }
    });
  } else {
    res.cookie('token', 'kek', cookieDel);
    res.cookie('cp002', false);
    console.log('utils 3');
    res.status(423).json({
      code: '423',
      message: 'Forbidden'
    });
  }
};

exports.verifyToken = verifyToken;