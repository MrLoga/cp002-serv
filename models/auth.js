import mongoose from 'mongoose';

const authSchema = new mongoose.Schema({
	address: String,
	requesting: String, // Имя сервиса
	status: {
		type: String,
		default: 'pending'
	},
	created: {
		type: Date,
		default: Date.now
	}
});

authSchema.statics.findAuth = async function (address, requesting) {
	let request = await this.find({
		address: address,
		requesting: requesting,
	});
	return request;
};


const Auth = mongoose.model('Auth', authSchema);

export default Auth;