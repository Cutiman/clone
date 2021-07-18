
const mongoose = require("mongoose");
const Schema  = mongoose.Schema;
const bcrypt  = require("bcrypt-nodejs");

const AdminSchema = new Schema({
	username:   { type: String, required: true, unique: true },
	password:   { type: String, required: true, hide: true },
	rights:     { type: Number, default: 0},
	token:      String,
	lastLogin:  String,
	regDate:    Date,
});

// Các phương thức ======================
// Tạo mã hóa mật khẩu
AdminSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(12), null);
};
// kiểm tra mật khẩu có trùng khớp
AdminSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.password);
};
const Admin = mongoose.model("Admin", AdminSchema);
module.exports = Admin;
