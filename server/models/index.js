import mongoose from 'mongoose';
// import Push from './push';
import Payment from './payment';
// import Message from './message';

mongoose.set('useFindAndModify', true);
const models = { Payment };
// const models = { Push, Message };

export default models;