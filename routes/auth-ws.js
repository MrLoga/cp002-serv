import errors from '../utils/errors';
import models from '../models';


async function findByAddress(address) {
	return await models.Payment.findPendingByAddress(address);
}
async function findPendingByAddress(address) {
	return await models.Payment.findPendingByAddress(address);
}

const wsAuthDB = new Map(); // Хранятся пары ключ значения

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
					wsAuthDB.set(msg.address, ws);
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
					wsAuthDB.get(msg._id).send(messageRaw);
					break;
				default: // Либо отдаём 404
					ws.send( JSON.stringify(errors['404']) )
					break;
			}
		}else if(msg.from==="service"){
			switch(msg.action) {
				case "payment":
					ws.customClientId = msg.requests[0]._id;
					wsAuthDB.set(msg.requests[0]._id, ws);
					if(wsAuthDB.has(msg.to) && wsAuthDB.get(msg.to)!="undefined"){
						msg.date = new Date();
						wsAuthDB.get(msg.to).send(JSON.stringify(msg));
					}
				default: // Либо отдаём 404
					ws.send(JSON.stringify(errors['404']));
					break;
			}
		}
	});
	ws.on('close', function(data) {
		console.log("delete", ws.customClientId);
		wsAuthDB.delete(ws.customClientId);
	});
};