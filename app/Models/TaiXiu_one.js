
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose);

const TaiXiu_oneSchema = new Schema({
	uid:      {type: String,  required: true},    // ID Người cược
	phien:    {type: Number,  required: true},    // phiên cược
	bet:      {type: Number,  required: true},    // số tiền cược
	red:      {type: Boolean, required: true},    // loại tiền (Red        = true, Xu       = false)
	taixiu:   {type: Boolean, required: true},    // loại game (tài xỉu    = true, chẵn nẻ  = false)
	select:   {type: Boolean, required: true},    // bên cược  (Tài = Chẵn = true, Xỉu = Lẻ = false)
	tralai:   {type: Number,  default: 0},        // Số tiền trả lại
	win:      {type: Boolean, default: false},	  // Thắng hoặc thua
	betwin:   {type: Number,  default: 0},	      // Tiền thắng được
});

TaiXiu_oneSchema.plugin(autoIncrement.plugin, {model:'TaiXiu_one', field:'id', startAt:1});

const TaiXiu_one = mongoose.model("TaiXiu_one", TaiXiu_oneSchema);
module.exports = TaiXiu_one;
