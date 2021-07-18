
const bcrypt = require("bcrypt-nodejs")

// mã hóa pass
const generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(12), null)
}
// so sánh pass
const validPassword = function(password, Hash) {
	return bcrypt.compareSync(password, Hash)
}

const anPhanTram = function(bet, he_so, ti_le){
	// he_so: số nhân
	// ti_le: tỉ lệ thuế
	return bet*he_so-Math.ceil(bet*ti_le/100);
}
// kiểm tra chuỗi chống
const isEmpty = function(str) {
	return (!str || 0 === str.length)
}
// đổi số thành tiền
const numberToBet = function(number){
	if (isEmpty(number))
		number = 0

	return new Intl.NumberFormat('vi-VN').format(number)
}
// đổi tiền thành số
const DotToNumber = function(str){
	return isEmpty(str) ? 0 : parseInt(str.replace(/\./gi, ""))
}
// reset định dạng tiền
const DotToBet = function(str){
	return numberToBet(DotToNumber(str))
}
// thêm số 0 trước dãy số (lấp đầy bằng số 0)
const numberPad = function(number, length) {
	// number: số
	// length: độ dài dãy số
	var str = '' + number
	while(str.length < length)
		str = '0' + str

	return str
}

module.exports = {
	generateHash:  generateHash,
	validPassword: validPassword,
	anPhanTram:    anPhanTram,
	isEmpty:       isEmpty,
	numberToBet:   numberToBet,
	DotToNumber:   DotToNumber,
	DotToBet:      DotToBet,
	numberPad:     numberPad,
}
