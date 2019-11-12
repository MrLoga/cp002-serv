import { Router } from 'express'
import axios from 'axios'
import Wallet from '../models/wallet'
import { asyncMiddleware, verifyToken } from '../utils'
const router = Router()
const WebSocketClient = require('websocket').client

router.get('/address/:address', (req, res) => {
  Wallet.find({address: req.params.address}).then(data => {
    res.json({
      wallet: data
    })
  }).catch(err => {
    console.log(err);
    res.status(500).send(err);
  })
})

router.get('/ws', (req, res) => {
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
      wsConnect.close()
      res.json({
        ws: msg.response
      })
    })
    wsConnect.sendUTF(JSON.stringify({
      from: 'server',
      action: 'status'
    }))
  })

  wsClient.connect(process.env.WS_API_URL)
})

router.get('/', (req, res) => {
  Wallet.find({}).then(data => {
    res.json({
      wallet: data  
    })
  }).catch(err => {
    console.log(err);
    res.status(500).send(err);
  })
})
router.get('/clear', (req, res) => {
  console.log("drop all Wallet");
  const requests = Wallet.deleteMany({}).then(data => {
    res.send(data)
  });
})

export default router
