"use strict";

require("dotenv/config");

var _express = _interopRequireDefault(require("express"));

var _http = _interopRequireDefault(require("http"));

var _path = _interopRequireDefault(require("path"));

var _serveFavicon = _interopRequireDefault(require("serve-favicon"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _morgan = _interopRequireDefault(require("morgan"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _reg = _interopRequireDefault(require("./routes/reg"));

var _login = _interopRequireDefault(require("./routes/login"));

var _wsroute = _interopRequireDefault(require("./routes/wsroute"));

var _payment = _interopRequireDefault(require("./routes/payment"));

var _status = _interopRequireDefault(require("./routes/status"));

var _currencyApi = _interopRequireDefault(require("./routes/currencyApi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();

var server = require('http').Server(app);

var expressWs = require('express-ws')(app, server); // app.use(cors());


app.use((0, _serveFavicon["default"])(_path["default"].join(__dirname, '../public', 'favicon.ico')));
app.use((0, _morgan["default"])('dev'));
app.use((0, _cookieParser["default"])());
app.use(_bodyParser["default"].json());
app.use(_express["default"].json());
app.use(_express["default"].urlencoded({
  extended: false
}));
app.use(_express["default"]["static"](_path["default"].join(__dirname, '../frontend/dist/pwa')));

_mongoose["default"].set('useFindAndModify', false);

_mongoose["default"].set('useUnifiedTopology', true);

var DB_options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  autoIndex: process.env.NODE_ENV !== "production"
};

_mongoose["default"].connect(process.env.DB_CONNECTION_STRING, DB_options);

var MConnect = _mongoose["default"].connection;
MConnect.on('error', console.error.bind(console, 'connection error:'));
MConnect.once('open', function () {
  console.log('connected to Mongo');
});
app.get('/api', function (req, res) {
  res.json({
    message: 'Welcome to the API'
  });
});
app.use('/api/reg', _reg["default"]);
app.use('/api/login/', _login["default"]);
app.ws('/api/ws', _wsroute["default"]);
app.use('/api/payment/', _payment["default"]);
app.use('/api/status', _status["default"]);
app.use('/api/currency', _currencyApi["default"]);
app.use('/', _express["default"]["static"](_path["default"].join(__dirname, '../frontend/dist/pwa')));
app.get('*', function (req, res) {
  res.status(404).send('Not Found');
}); // export default app;

module.exports = {
  app: app,
  server: server
};