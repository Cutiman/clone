
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose);

const TaiXiu_chatSchema = new Schema({
	uid:   {type: String, required: true},
	name:  {type: String, required: true},
	value: {type: String, required: true},
	type:  {type: Number},
});

TaiXiu_chatSchema.plugin(autoIncrement.plugin, {model:'TaiXiu_chat', field:'id', startAt:1});

const TaiXiu_chat = mongoose.model("TaiXiu_chat", TaiXiu_chatSchema);
module.exports = TaiXiu_chat;
