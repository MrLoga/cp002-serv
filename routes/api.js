import { Router } from 'express';
import models from '../models';

import asyncMiddleware from '../utils/asyncMiddleware';
const router = Router();

var WebSocketClient = require('websocket').client;


router.post('/payment/:address', asyncMiddleware(async (req, res) => {
	// if (req.headers.host != req.headers.origin) return res.send("Hi");

	const request = await models.Request.create({
		address: req.params.address,
		type: "payment",
		txArray: req.body.data,
		requesting: req.headers.origin
	});

	let client = new WebSocketClient();
	client.on('connect', (connection) => {
		let timerId = setTimeout(()=>{
			connection.close();
			// const requestResult = updateRequest(request._id, "timeout", ["false"]);
			models.Request.findOneAndUpdate({ _id: request._id }, { $set: { "status": "timeout" }, $push: { "txHash": "false" } }, { new: true },).then((updateDoc)=>{
				return res.send(updateDoc);
			});
		}, 60*1000);

		connection.on('message', (messageRaw) => {
			let msg = JSON.parse(messageRaw.utf8Data);
			// console.log(msg);
			if(msg.from == "user" && (msg.status == "resolve" || msg.status == "reject")){
				// const updateDoc = updateRequest(msg._id, msg.status, msg.hash);
				models.Request.findOneAndUpdate({ _id: msg._id }, { $set: { "status": msg.status }, $push: { "txHash": { $each: msg.hash } } }, { new: true },).then((updateDoc)=>{
					clearTimeout(timerId);
					connection.close(updateDoc);
					return res.send(messageRaw.utf8Data);
				});
			}
		});
		connection.on('close', (messageRaw) => {
			console.log("close",messageRaw);
		});
		connection.sendUTF(JSON.stringify({
			from: "service",
			action: "payment",
			to: request.address,
			requests: [request],
		}));
	});
	client.connect('ws://cp002.na4u.ru/api/payment');

}));

router.get('/requests/:address', asyncMiddleware(async (req, res) => {
	// if (req.headers.host != req.headers.origin) return res.send("Hi");
	const requests = await models.Request.findByAddress(req.params.address);
	return res.send(requests);
}));

router.post('/bill/:address', asyncMiddleware(async (req, res) => {
	const request = await models.Request.create({
		address: req.params.address,
		type: "bill",
		b64tx: req.body.b64tx,
		requesting: req.headers.origin
	});
	return res.send(request);
}));
// router.get('/save/:address/', asyncMiddleware(async (req, res) => {
// 	const push = await models.Request.create({
// 		_id: req.params.address,
// 		pub: "123",
// 	});
// 	return res.send(push);
// }));

router.get('/clear', asyncMiddleware(async (req, res) => {
	console.log("drop");
	const requests = await models.Request.deleteMany({});
	return res.send(requests);
}));

router.delete('/:address', asyncMiddleware(async (req, res) => {
	const push = await models.Request.findByAddress(req.params.address);
	let result = null;
	if(push){
		result = await push.deleteOne();
	}
	return res.send(result);
}));

router.put('/', (req, res) => {
	return res.send('Received a PUT HTTP method');
});

export default router;
