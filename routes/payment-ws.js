import errors from '../utils/errors';
// import models from '../models';
import Payment from '../models/payment';

async function findPendingByAddress(address) {
	return await Payment.findPendingByAddress(address);
}

const wsPaymentDB = new Map();

export default function(ws, req) {
	ws.on('message', function(messageRaw) {
		let msg = false;
		try {
			msg = JSON.parse(messageRaw);
		} catch(e) {
			ws.send(JSON.stringify(errors['400']));
		}

		if(msg.from==="user"){
			switch(msg.status) {
				case "open":
					ws.customClientId = msg.address;
					wsPaymentDB.set(msg.address, ws);
					findPendingByAddress(msg.address).then((requests)=>{
						ws.send(JSON.stringify({
							from: "user",
							status: "pending",
							date: new Date(),
							requests: requests
						}));
					});
					break;
				case "resolve":
				case "reject":
					if(wsPaymentDB.has(msg._id) && wsPaymentDB.get(msg._id)!="undefined"){
						Payment.findByIdAndUpdate({ _id: msg._id }, { $set: { "status": msg.status }, $push: { "txHash": { $each: msg.hash } } }, { new: true },)
							.then((updateDoc)=>{
								wsPaymentDB.get(msg._id).send(messageRaw);
							}).catch(err => {
								console.log(err);
								wsPaymentDB.get(msg._id).send('{"from":"user","status":"error","_id":"'+msg._id+'"}');
							});
					}
					break;
				default: // Либо отдаём 404
					ws.send( JSON.stringify(errors['404']) )
					break;
			}
		}else if(msg.from==="service"){
			switch(msg.action) {
				case "payment":
					ws.customClientId = msg.requests[0]._id;
					wsPaymentDB.set(msg.requests[0]._id, ws);
					if(wsPaymentDB.has(msg.to) && wsPaymentDB.get(msg.to)!="undefined"){
						msg.date = new Date();
						wsPaymentDB.get(msg.to).send(JSON.stringify(msg));
					}
				default: // Либо отдаём 404
					ws.send(JSON.stringify(errors['404']));
					break;
			}
		}
	});
	ws.on('close', function(data) {
		// console.log("delete", ws.customClientId);
		wsPaymentDB.delete(ws.customClientId);
	});
};