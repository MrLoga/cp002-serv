import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
	address: String,
	type: String, // bill выставление счета, payment оплата в течении 30 сек
	txArray: [{
		type: String // base64 транзакции
	}],
	// txdata: Buffer, // base64 транзакции
	status: {
		type: String,
		default: 'pending'
	},
	txHash: [{
		type: String // base64 транзакции
	}],
	requesting: String, // Имя сервиса
	created: {
		type: Date,
		default: Date.now
	}
});

requestSchema.statics.findByAddress = async function (address) {
	let request = await this.find({
		address: address,
	});
	return request;
};
requestSchema.statics.findPendingByAddress = async function (address) {
	let request = await this.find({
		address: address,
		status: 'pending',
	});
	return request;
};


const Request = mongoose.model('Request', requestSchema);

export default Request;