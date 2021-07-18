
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mPokerSchema = new Schema({
	name: {type: String,  required: true},
	win:  {type: Number,  default: 0},
	bet:  {type: Number,  default: 0},
	red:  {type: Boolean, required: true},
	type: {type: Number,  default: 0},
	time: {type: Date,    default: new Date()},
});

const mPoker = mongoose.model("mPokerTop", mPokerSchema);
module.exports = mPoker;
