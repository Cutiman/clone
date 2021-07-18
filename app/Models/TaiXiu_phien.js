
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose);

const TaiXiu_phienSchema = new Schema({
	dice1: {type: Number},
	dice2: {type: Number},
	dice3: {type: Number},
	time:  {type: Date, default: new Date()},
});

TaiXiu_phienSchema.plugin(autoIncrement.plugin, {model:'TaiXiu_phien', field:'id', startAt:1});

const TaiXiu_phien = mongoose.model("TaiXiu_phien", TaiXiu_phienSchema);
module.exports = TaiXiu_phien;
