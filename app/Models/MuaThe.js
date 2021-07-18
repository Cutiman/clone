
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MuaTheSchema = new Schema({
	uid:     {type: String, required: true}, // ID Người chơi
	name:    {type: String, required: true}, // Tên người chơi
	nhaMang: {type: String, required: true}, // Nhà mạng
	menhGia: {type: String, required: true}, // Mệnh giá
	soLuong: {type: Number, required: true}, // Số lượng
	status:  {type: Number, default:  0},    // Trạng thái mua
	time:    Date,                           // Thời gian mua
	check:   Date,                           // Thời gian được kiểm duyệt
});

module.exports = mongoose.model("MuaThe", MuaTheSchema);
