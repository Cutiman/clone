
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose);

const mPokerSchema = new Schema({
	name: {type: String, required: true},
	win:  {type: Number, default: 0},
	type: {type: Number, default: 0},
	kq:   [],
	time: {type: Date,   default: new Date()},
});

mPokerSchema.plugin(autoIncrement.plugin, {model:'mPoker10kR', field:'id', startAt:1});

const mPoker = mongoose.model("mPoker10kR", mPokerSchema);
module.exports = mPoker;
