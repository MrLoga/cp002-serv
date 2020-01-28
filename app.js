import 'dotenv/config';
import express from 'express';
let app = express();

import http from 'http';
let server = require('http').Server(app);

import path from 'path';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import logger from 'morgan';

import mongoose from 'mongoose';
let expressWs = require('express-ws')(app, server)

// app.use(cors());
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '/cp002/dist/pwa')));

mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);
const DB_options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  autoIndex: process.env.NODE_ENV !== "production"
};
mongoose.connect(process.env.DB_CONNECTION_STRING, DB_options);
const MConnect = mongoose.connection;
MConnect.on('error', console.error.bind(console, 'connection error:'));  
MConnect.once('open', () =>{ console.log('connected to Mongo') });

import routerReg from './routes/reg';
import routerLogin from './routes/login';
import wsRoute from './routes/wsroute';
import routerPayment from './routes/payment';
import routerStatus from './routes/status';
import currencyApi from './routes/currencyApi';

app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to the API'
  })
})
app.use('/api/reg', routerReg)
app.use('/api/login/', routerLogin)
app.ws('/api/ws', wsRoute)
app.use('/api/payment/', routerPayment)
app.use('/api/status', routerStatus)
app.use('/api/currency', currencyApi)

app.use('/', express.static(path.join(__dirname, '/cp002/dist/pwa')));

app.get('*', function(req, res){
	res.status(404).send('Not Found');
})

// export default app;
module.exports = { app: app, server: server };
