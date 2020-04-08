import { Router } from 'express';
import Payment from '../models/payment';
import { asyncMiddleware, verifyToken } from '../utils';

const router = Router();

var WebSocketClient = require('websocket').client;


router.post('/:address', verifyToken, asyncMiddleware(async (req, res) => {
  // if (req.headers.host != req.headers.origin) return res.send("Hi");
  // var origin = req.get('origin');
  // var host = req.get('host')
  console.log(req.tokenData)
  
  const appOrigin = req.get('origin')
  let request;
  try {
    request = await Payment.create({
      address: req.params.address,
      requesting: appOrigin,
      txArray: req.body.data
    });
  } catch (error) {
    console.log("payment.js routes error");
    console.log(error);
  }

  console.log(request)
  let wsPaymentClient = new WebSocketClient();
  wsPaymentClient.on('connect', (wsConnect) => {

    let timerId = setTimeout(() => {
      wsConnect.close()
      Payment.findByIdAndUpdate({ _id: request._id }, { $set: { "status": "timeout" } }, { new: true, select: "address status -_id" })
        .then(updateDoc => {
          console.log('timeout')
          res.status(408).send(updateDoc)
        }).catch(err => {
          console.log(err);
          res.status(500).send(err);
        });
    }, 60*1000);

    wsConnect.on('message', (messageRaw) => {
      let msg = JSON.parse(messageRaw.utf8Data);
      if (msg.from == 'wallet' && msg.response[0] === "reject") {
        clearTimeout(timerId);
        wsConnect.close();
        console.log('reject')
        res.send(messageRaw.utf8Data);
      }else if(msg.from == "user" && msg.response[0] === "resolve"){
        clearTimeout(timerId);
        wsConnect.close();
        console.log('resolve')
        res.status(500).send(messageRaw.utf8Data);
      }
    });
    // wsConnect.on('close', (x,y) => {});
    wsConnect.sendUTF(JSON.stringify({
      from: 'app',
      action: 'payment',
      to: request.address,
      requests: [request],
    }));
  });

  wsPaymentClient.connect(process.env.WS_API_URL + '/payment');
}))


router.get('/clear', asyncMiddleware(async (req, res) => {
  console.log("drop");
  const requests = await Payment.deleteMany({});
  return res.send(requests);
}));

router.get('/:address', asyncMiddleware(async (req, res) => {
  // if (req.headers.host != req.headers.origin) return res.send("Hi");
  const requests = await Payment.findByAddress(req.params.address);
  return res.send(requests);
}));

router.post('/bill/:address', asyncMiddleware(async (req, res) => {
  const request = await Payment.create({
    address: req.params.address,
    type: "bill",
    b64tx: req.body.b64tx,
    requesting: req.headers.origin
  });
  return res.send(request);
}));
// router.get('/save/:address/', asyncMiddleware(async (req, res) => {
//  const push = await Payment.create({
//    _id: req.params.address,
//    pub: "123",
//  });
//  return res.send(push);
// }));



// router.delete('/:address', asyncMiddleware(async (req, res) => {
//  const push = await Payment.find(req.params.address);
//  let result = null;
//  if(push){
//    result = await push.deleteOne();
//  }
//  return res.send(result);
// }));

router.put('/', (req, res) => {
  return res.send('Received a PUT HTTP method');
});

export default router;