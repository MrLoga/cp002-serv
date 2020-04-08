import Wallet from '../models/wallet'


function findByAddress(address) {
	return Payment.findPendingByAddress(address);
}
// async function findPendingByNonce(address) {
// 	return await ;
// }

const wsDB = new Map(); // Хранятся пары ключ значения

export default function(ws, req) {
	ws.on('message', function(messageRaw) {
		let msg = false;
		try {
			msg = JSON.parse(messageRaw);
		} catch(e) {
			ws.send(JSON.stringify(errors['400']));
		}

		if (msg.from === 'server') {
			switch (msg.action) {
				case 'status':
					ws.send(JSON.stringify({
						from: 'server',
						action: 'status',
						date: new Date(),
						response: [ ...wsDB.keys() ]
					}))
					break
			}
		} else if (msg.from === 'wallet') {
			switch (msg.action) {
				case 'connect':
					ws.customClientId = msg.id
					wsDB.set(msg.id, ws);
					// let keys = [ ...wsDB.keys() ]
					// console.log(keys)
					Wallet.findOne({ nonce: msg.id }, 'login').then(walletDoc => {
						ws.send(JSON.stringify({
							from: 'server',
							action: 'connect',
							date: new Date(),
							response: [walletDoc.login]
						}))
					})
					// Payment.findPendingByNonce(msg.id).then(requests => {
					// })
					break
				case 'login':
					wsDB.get(msg.to).send(messageRaw)
					break
				case 'payment':
					wsDB.get(msg.to).send(messageRaw)
					break
				case 'remove-auth':
					Wallet.findOne({ nonce: msg.id }, 'login').then(walletDoc => {
						console.log(walletDoc)
						delete walletDoc.login[msg.requests[0]]
						walletDoc.markModified('login')
            walletDoc.save().then(walletSave => {
							ws.send(JSON.stringify({
								from: 'server',
								action: 'remove-auth',
								response: [walletSave.login]
							})) 
            }).catch(err => {
              console.log(err)
            })
					})
					break
				default: // Либо отдаём 404
					ws.send( JSON.stringify(errors['404']) )
					break
			}
		} else if (msg.from === 'app') {
			ws.customClientId = msg.id;
			wsDB.set(msg.id, ws);
			if (wsDB.has(msg.to) && wsDB.get(msg.to) !== undefined) {
				msg.date = new Date();
				wsDB.get(msg.to).send(JSON.stringify(msg));
			} else {
				ws.send(JSON.stringify({
					from: 'server',
					action: msg.action,
					date: new Date(),
					response: [421]
				}));
			}
		}
	});
	ws.on('close', function(data) {
		console.log("delete", ws.customClientId);
		wsDB.delete(ws.customClientId);
	});
};