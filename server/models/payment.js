import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
	address: String,
	requesting: String, // Имя сервиса
	// type: String, // bill выставление счета, payment оплата в течении 30 сек
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
	created: {
		type: Date,
		default: Date.now
	}
});

// paymentSchema.statics.findByAddress = async function (address) {
// 	let request = await this.find({
// 		address: address,
// 	});
// 	return request;
// };
paymentSchema.statics.findPendingByNonce = async function (address) {
	let request = await this.find({
		address: address,
		status: 'pending',
	});
	return request;
};


const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;