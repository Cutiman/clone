
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NapTheSchema = new Schema({
	uid:     {type: String, required: true}, // ID Người chơi
	name:    {type: String, required: true}, // Tên người chơi
	nhaMang: {type: String, required: true}, // Nhà mạng
	menhGia: {type: String, required: true}, // Mệnh giá
	nhan:    {type: Number, default: 0},     // Nhận
	maThe:   {type: Number, required: true}, // Mã Thẻ
	seri:    {type: Number, required: true}, // Seri
	status:  {type: Number, default: 0},     // Trạng thái nạp
	time:    Date,                           // Thời gian nạp
	check:   Date,                           // Thời gian được kiểm duyệt
});

module.exports = mongoose.model("NapThe", NapTheSchema);
