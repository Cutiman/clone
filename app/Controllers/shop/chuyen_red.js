
const tab_ChuyenRed = require('../../Models/ChuyenRed');
const tab_UserInfo  = require('../../Models/UserInfo');
const tab_DaiLy     = require('../../Models/DaiLy');

const Helper        = require('../../Helpers/Helpers');

module.exports = function(client, data){
	var user_name = data.name;
	var red       = Math.abs(parseInt(data.red));
	var message   = data.message;
	var otp       = data.otp;

	var type_name    = typeof user_name;
	var type_message = typeof message;
	var type_otp     = typeof otp;

	if (type_name !== "string" || type_message !== "string" || type_otp !== "string" || isNaN(red)) {
		client.emit('p', {notice:{title:'CHUYỂN RED',text:'Thông tin không đúng.!!'}});
		return;
	}else{
		var regex = new RegExp("^" + user_name + "$", 'i')
		var active1 = tab_DaiLy.findOne({nickname: {$regex: regex}}).exec()
		var active2 = tab_UserInfo.findOne({name: {$regex: regex}}, 'id name').exec()
		var active3 = tab_UserInfo.findOne({id: client.UID}, 'red').exec()
		Promise.all([active1, active2, active3])
		.then(valuesCheck => {
			var daily = valuesCheck[0];
			var to    = valuesCheck[1];
			var user  = valuesCheck[2];
			if (!!to) {
				if (to.id == client.UID) {
					client.emit('p', {notice:{title:'CHUYỂN RED',text:'Bạn không thể chuyển cho chính mình.!!'}});
				}else{
					if (user == null || (user.red-10000 < red)) {
						client.emit('p', {notice:{title:'CHUYỂN RED',text:'Số dư không khả dụng.!!'}});
					}else{
						tab_UserInfo.findOneAndUpdate({id: client.UID}, {$inc:{red:-red}}, function(err,cat){
							client.emit('p', {shop:{chuyen_red:{status:200, text:'Giao dịch thành công.!!'}}, user:{red:cat.red-red}});
						});
						var chiet_khau = !!daily ? 0 : Math.floor(red*2/100);
						var thanhTien = red-chiet_khau;
						tab_ChuyenRed.create({'from':client.profile.name, 'to':to.name, 'red':red, 'red_c':thanhTien, 'message':message, 'time': new Date()});
						tab_UserInfo.findOneAndUpdate({name: {$regex: regex}}, {$inc:{red:thanhTien}}, function(err,cat){
							Promise.all(Object.values(client.server.nsps['/users'].sockets).map(function(obj){
								if (obj.UID !== void 0 && obj.UID == cat.id)
									client.server.nsps['/users'].to(obj.id).emit('p', {notice:{title:'CHUYỂN RED', text:'Bạn nhận được ' + Helper.numberToBet(thanhTien) + ' Red.' + "\n" + 'Từ người chơi: ' + client.profile.name}, user:{red:cat.red+thanhTien}});
							}));
						});
					}
				}
			}else{
				client.emit('p', {notice:{title:'CHUYỂN RED',text:'Người dùng không tồn tại.!!'}});
			}
		})

	}
}
