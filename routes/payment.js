import { Router } from 'express'
import jwt from 'jsonwebtoken'
import cors from 'cors'
import nacl from 'tweetnacl'
import Wallet from '../models/wallet'
import { asyncMiddleware, verifyToken } from '../utils';
import { createBox, openBox, getNewNonce, getHash } from '../utils/nacl'
const router = Router()
const WebSocketClient = require('websocket').client;

const corsOptions = {
  origin: '*',
  methods: 'POST, GET, OPTIONS',
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  preflightContinue: true,
  optionsSuccessStatus: 204
}

router.options('*', verifyToken, cors(corsOptions))

router.post('/', verifyToken, cors(corsOptions), (req, res) => {
  const appOrigin = req.get('origin')
  if (!appOrigin.length) {
    res.status(406).json({
      code: '406',
      message: 'Not Acceptable'
    })
  }
  let txData = []
  if (Array.isArray(req.body)) {
    txData = req.body
  } else if (typeof txData === 'object') {
    txData.push(req.body)
  }
  if (txData.length === 0) {
    res.status(406).json({
      code: '406',
      message: 'Not Acceptable, body is empty'
    })
  }
  for (let item of txData) {
    if (!item.txAction && typeof item.txAction !== 'string'){
      res.status(406).json({
        code: '406',
        message: 'Not Acceptable, txAction error'
      })
    }
  }

  Wallet.findById(req.tokenData.w, 'key nonce address login').then(walletDoc => {
    let appNonce = 'none'
    if (walletDoc.get('login') && walletDoc.login[appOrigin]) {
      appNonce = walletDoc.login[appOrigin]
    }
    if (appNonce === 'none' || appNonce !== req.tokenData.n) {
      res.cookie('token', 'kek', { maxAge: 1, httpOnly: true })
      return res.status(403).json({
        code: '423',
        message: 'Forbidden'
      })
    } else if (appNonce === 'blocked') {
      res.cookie('token', 'kek', { maxAge: 1, httpOnly: true })
      return res.status(423).json({
        code: '423',
        message: 'Blocked by user'
      })
    } else {
      console.log(appOrigin + ' : ' + appNonce)

      let wsClient = new WebSocketClient()
      wsClient.on('connect', wsConnect => {

        let timerId = setTimeout(() => {
          wsConnect.close();
          res.status(408).send(JSON.stringify({
            code: '408',
            message: 'Request Timeout'
          }))
        }, 60*1000)

        wsConnect.on('message', (messageRaw) => {
          let msg = JSON.parse(messageRaw.utf8Data);
          clearTimeout(timerId);
          wsConnect.close();
          if (msg.response[0] && msg.response[0] === null) {
            res.status(500).json({
              code: '500',
              message: 'Undefined error (response return null)'
            })
          } else if (msg.action === 'payment' && msg.from === 'wallet' && typeof msg.response[0] === 'string') {
            if (msg.response[0] === 'reject') {
              res.json({
                code: '200',
                message: 'Reject'
              })
            } else if (typeof msg.response[0] === 'string') {
              res.json({
                code: '200',
                message: 'Resolve',
                hash: msg.response
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
          id: getHash(appOrigin + appNonce),
          url: appOrigin,
          from: 'app',
          action: 'payment',
          to: walletDoc.nonce,
          requests: txData
        }))
      })

      wsClient.connect(process.env.WS_API_URL);
    }

  }).catch(err => {
    console.log(err);
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
