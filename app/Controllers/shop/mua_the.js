
const MuaThe        = require('../../Models/MuaThe');
const MuaThe_thenap = require('../../Models/MuaThe_card');
const tab_UserInfo  = require('../../Models/UserInfo');

const NhaMang       = require('../../Models/NhaMang');
const MenhGia       = require('../../Models/MenhGia');

module.exports = function(client, data){
	var nhaMang = data.nhamang;
	var menhGia = data.menhgia;
	var soluong = Math.abs(parseInt(data.soluong));
	//var otp     = data.otp;

	var check1 = NhaMang.findOne({name: nhaMang, mua: true}).exec();
	var check2 = MenhGia.findOne({name: menhGia, mua: true}).exec();

	Promise.all([check1, check2])
	.then(values => {
		if (!!values[0] && !!values[1] && !isNaN(soluong)) {
			var totallBet = values[1].values*soluong;
			tab_UserInfo.findOne({id: client.UID}, 'red name', function(err, check){
				if (check === null || (check.red <= totallBet)) {
					client.emit('p', {notice:{title:'MUA THẺ',text:'Số dư không khả dụng.!!'}});
				}else{
					tab_UserInfo.findOneAndUpdate({id: client.UID}, {$inc:{red:-totallBet}}, function(err, user){
						client.emit('p', {shop:{mua_the:{status:200, text:'Yêu cầu mua thẻ thành công.!!'}}, user:{red:user.red-totallBet}});
					});
					MuaThe.create({'uid':client.UID, 'name':client.profile.name, 'nhaMang':nhaMang, 'menhGia':menhGia, 'soLuong':soluong, 'time': new Date()},
						function (err, data) {
		  					if (data) {
								while(soluong > 0){
									MuaThe_thenap.create({'cart':data._id, 'nhaMang':nhaMang, 'menhGia':menhGia});
									soluong--;
								}
		  					}
						}
					);
				}
			});
		}else{
			client.emit('p', {notice:{title:'MUA THẺ',text:'Thẻ nạp không được hỗ trợ.!!'}});
		}
	})
}
