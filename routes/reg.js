import { Router } from 'express'
import cors from 'cors'
import axios from 'axios'
import Wallet from '../models/wallet'
import { asyncMiddleware } from '../utils'
import { createBox, openBox } from '../utils/nacl'
import nacl from 'tweetnacl'
nacl.util = require('tweetnacl-util')

const router = Router()
const corsOptions = {
  // origin: '*',
  // origin: 'https://cp002.na4u.ru/',
  origin: process.env.LOCAL_URL,
  methods: 'POST, GET, OPTIONS',
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  preflightContinue: true,
  optionsSuccessStatus: 204
}
const explorerApi = 'https://explorer-api.minter.network/api/v1/'

router.options('*', cors(corsOptions))

router.get('/address/:address', cors(corsOptions), (req, res) => {
  Wallet.findOne({ address: req.params.address})
  .then(doc => {
    res.send(doc)
  }).catch(err => {
    console.log(err);
    res.status(500).send(err);
  })
})

router.post('/:hash', cors(corsOptions), (req, res) => {
  axios.get(`${explorerApi}transactions/${req.params.hash}`).then(data => {
    const txData = data.data.data
    const verifyTextB64 = nacl.util.encodeUTF8(nacl.util.decodeBase64(txData.payload))
    const textOpenBox = openBox(verifyTextB64, req.body.userNonceString, req.body.userKeyString)
    if (textOpenBox === 'verify') {
      Wallet.findOne({ address: txData.from }).then(walletDoc => {
        if (walletDoc === null) {
          let newWallet = new Wallet({
            address: txData.from,
            key: req.body.userKeyString,
            nonce: req.body.userNonceString,
            created: new Date()
          })
          newWallet.save().then(newSaveDoc => {
            res.send(newSaveDoc)
          })
        } else {
          res.send(walletDoc)
        }
      }).catch(err => {
        console.log(err)
        res.status(500).send(err)
      })
    } else {
      res.status(412).send('Verify FALSE');
    }
  }).catch(error => {
    res.status(error.response.status).send(error.response.statusText);
  })
})

export default router

// Если адрес уже есть, то нужно подтверждение чтоб выдать те же ключи и нонс
// Должен доказать что он владелец адреса
