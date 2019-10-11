import { Router } from 'express';
// import models from '../models';
import Auth from '../models/auth';

import asyncMiddleware from '../utils/asyncMiddleware';
const router = Router();

var WebSocketClient = require('websocket').client;


// запрос от сервиса клиенту с целью пройти регистрацию таймаут 60 сек

router.post('/:address', asyncMiddleware(async (req, res) => {

	const request = await Auth.create({
		address: req.params.address,
		requesting: req.headers.origin,
	});

	let wsClient = new WebSocketClient();
	wsClient.on('connect', (connection) => {

		// таймер 60 сек
		let timerId = setTimeout(()=>{
			connection.close();
			Auth.findOneAndUpdate({ _id: request._id }, { $set: { "status": "timeout" }, $push: { "txHash": "false" } }, { new: true },)
				.then((updateDoc)=>{
					return res.send(updateDoc);
				}).catch(err => {
					console.log(err);
					res.status(500).send(err);
				});
		}, 60*1000);

		connection.on('message', (messageRaw) => {
			let msg = JSON.parse(messageRaw.utf8Data);
			// console.log(msg);
			if(msg.from == "user" && (msg.status == "resolve" || msg.status == "reject")){
				// const updateDoc = updatePayment(msg._id, msg.status, msg.hash);
				Auth.findOneAndUpdate({ _id: msg._id }, { $set: { "status": msg.status }, $push: { "txHash": { $each: msg.hash } } }, { new: true },).then((updateDoc)=>{
					clearTimeout(timerId);
					connection.close();
					console.log(updateDoc);
					return res.send(messageRaw.utf8Data);
				});
			}
		});
		connection.on('close', (x,y) => {
			console.log("11 close ", x);
			console.log("22 close ", y);
		});
		connection.sendUTF(JSON.stringify({
			from: "service",
			action: "payment",
			to: request.address,
			requests: [request],
		}));
	});
	console.log(process.env.WS_API_URL);
	wsClient.connect(process.env.WS_API_URL + '/auth');

}));

router.get('/:address', asyncMiddleware(async (req, res) => {
	// if (req.headers.host != req.headers.origin) return res.send("Hi");
	const requests = await Auth.findByAddress(req.params.address);
	return res.send(requests);
}));




export default router;
