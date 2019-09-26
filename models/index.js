import mongoose from 'mongoose';
// import Push from './push';
import Request from './request';
// import Message from './message';

mongoose.set('useFindAndModify', false);
const models = { Request };
// const models = { Push, Message };

export default models;