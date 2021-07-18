
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GiftCodeSchema = new Schema({
	uid:    {type: String},
	create: {type: String},
	code:   {type: String, unique:  true},
	red:    {type: Number, default: 0},
	xu:     {type: Number, default: 0},
	type:   {type: String, default: ''},
    date:   {type: Date,   default: new Date()},
    todate: {type: Date},
});

const GiftCode = mongoose.model("GiftCode", GiftCodeSchema);
module.exports = GiftCode;
