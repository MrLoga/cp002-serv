import { Router } from 'express'
import axios from 'axios'
import cors from 'cors'
import Currency from '../models/currency'
import { asyncMiddleware, verifyToken } from '../utils'
const router = Router()

router.options('*', cors(corsOptions))
const corsOptions = {
  origin: function (origin, callback) {
    callback(null, true)
    // if (whitelist.indexOf(origin) !== -1) {
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
}

router.get('/', cors(corsOptions), asyncMiddleware(async (req, res) => {
  // if (req.headers.host != req.headers.origin) return res.send("Hi");
  const currencyData = await Currency.find({}, 'pair value -_id')
  res.status(200).json(currencyData)
}))

router.get('/update', (req, res) => {
  axios.get('https://currate.ru/api/?get=rates&pairs=USDRUB,USDEUR&key=' + process.env.CURRATE_KEY).then(response => {
    let currencyData = response.data.data
    console.log('/////////////')
    console.log(currencyData)
    console.log('/////////////')
    let currencyTmp = []
    for (var item in currencyData) {
      currencyTmp.push({ pair: item, value: currencyData[item] })
      console.log(item + '.' + currencyData[item])
    }
    if (currencyTmp.length) {}
    Currency.deleteMany({}).then(docs => {
      console.log()
      Currency.create(currencyTmp).then(docsCreate => {
        res.status(200).json({
          code: '200',
          message: docsCreate
        })
      }).catch(err => {
        res.status(500).json({
          code: '500',
          message: err
        })
      })
    }).catch(err => {
      res.status(500).json({
        code: '500',
        message: err
      })
    })
    // console.log(response.data)
    // res.status(200).json(response.data.data)
  }).catch(err => {
    console.log(err);
    res.status(500).send(err);
  });
})

export default router
