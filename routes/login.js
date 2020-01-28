import { Router } from 'express'
import jwt from 'jsonwebtoken'
import cors from 'cors'
import nacl from 'tweetnacl'
import Wallet from '../models/wallet'
import { asyncMiddleware } from '../utils';
import { createBox, openBox, getNewNonce, getHash } from '../utils/nacl'
const router = Router()
const WebSocketClient = require('websocket').client;

var whitelist = ['http://example1.com', 'http://example2.com']

const corsOptions = {
  origin: function (origin, callback) {
    callback(null, true)
    // if (whitelist.indexOf(origin) !== -1) {
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
}
const cookieOptions = {
  maxAge: 30*24*60*60*1000, // 30 day
  httpOnly: true
}
router.options('*', cors(corsOptions))

router.post('/', cors(corsOptions), (req, res) => {
  const appOrigin = req.get('origin')
  if (!appOrigin.length) {
    res.status(400).json({
      code: '400',
      message: 'Bad Request'
    })
  }

  Wallet.findOne({ address: req.body.address }, 'key nonce address login').then(walletDoc => {
    if (!walletDoc) {
      return res.status(404).json({
        code: '404',
        message: 'Address not found'
      })
    }
    let loginNonce = ''
    if (!walletDoc.get('login')){
      walletDoc.login = {}
    }
    if (walletDoc.get('login') && walletDoc.login[appOrigin]) {
      loginNonce = walletDoc.login[appOrigin]
    }

    if (loginNonce === 'blocked') {
      return res.status(423).json({
        code: '423',
        message: 'Blocked by user'
      })
    } else {
      console.log('login 1 | ' + appOrigin + ' : ' + loginNonce)

      let wsClient = new WebSocketClient()
      wsClient.on('connect', wsConnect => {

        let timerId = setTimeout(() => {
          wsConnect.close();
          res.status(408).json({
            code: '408',
            message: 'Request Timeout'
          })
        }, 60*1000); 

        wsConnect.on('message', (messageRaw) => {
          let msg = JSON.parse(messageRaw.utf8Data);
          clearTimeout(timerId);
          wsConnect.close();
          console.log('login 2 | ' + msg)
          console.log(msg)
          console.log('-- // login 2 | ' + msg)
          if (msg.response[0] && msg.response[0] === null) {
            res.status(500).json({
              code: '500',
              message: 'Undefined error (response return null)'
            })
          } else if (msg.action === 'login' && msg.from === 'wallet' && typeof msg.response[0] === 'string') {
            if (msg.response[0] === 'reject') {
              res.cookie('cp002', 'reject')
              res.json({
                code: '401',
                message: 'Wallet rejected'
              })
            } else if (msg.response[0] === 'blocked') {
              walletDoc.login[appOrigin] = 'blocked'
              walletDoc.markModified('login')
              walletDoc.save().then(walletSave => {
                res.cookie('cp002', 'blocked')
                res.status(423).json({
                  code: '423',
                  message: 'Blocked by wallet'
                })
              }).catch(err => {
                console.log('login err 1 | ' + err)
                res.status(500).send(err)
              })
            } else {
              walletDoc.login[appOrigin] = msg.response[0]
              // console.log(walletDoc.login)
              walletDoc.markModified('login')
              walletDoc.save().then(walletSave => {
                // const walletSecret = createBox(msg.response[0], process.env.NACL_NONCE, process.env.NACL_SECRET) // app nonce
                jwt.sign({
                  w: walletDoc._id,
                  n: msg.response[0], // app nonce
                  aud: appOrigin
                }, process.env.NACL_SECRET, { expiresIn: '7d' }, (err, token) => {
                  res.cookie('token', token, cookieOptions)
                  res.cookie('cp002', true, { maxAge: 7*24*60*60*1000 })
                  res.json({
                    code: '200',
                    message: 'Access granted'
                  })
                })
              }).catch(err => {
                console.log('login err 2 | ' + err)
                res.status(500).send(err)
              })
            }
          } else if (msg.from === 'server' && msg.response[0] === 421) {
            res.status(421).json({
              code: '421',
              message: 'This user is offline or not available'
            })
          } else {
            res.status(418).json({
              code: '418',
              message: 'Undefined error (#418)'
            })
          }
        })
        // wsConnect.on('close', (x,y) => {});
        wsConnect.sendUTF(JSON.stringify({
          id: getHash(appOrigin+req.params.address),
          url: appOrigin,
          from: 'app',
          action: 'login',
          to: walletDoc.nonce,
          requests: [appOrigin]
        }))
      })

      wsClient.connect(process.env.WS_API_URL);
    }

  }).catch(err => {
    console.log('login err 3 | ' + err);
    res.status(500).send(err) 
  })
})

router.get('/', (req, res) => {
  res.json({
    code: '405',
    message: 'Method Not Allowed'
  })
})

export default router
