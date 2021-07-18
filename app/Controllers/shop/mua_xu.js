
const tab_MuaXu    = require('../../Models/MuaXu');
const tab_UserInfo = require('../../Models/UserInfo');

module.exports = function(client, data){
	var red = Math.abs(parseInt(data.red));

	if (isNaN(red)) {
		client.emit('p', {notice:{title:'MUA XU',text:'Thông tin không đúng.!!'}});
		return;
	}else{
		tab_UserInfo.findOne({id: client.UID}, 'red name', async function(err, user){
			if (user === null || (user.red < red)) {
				client.emit('p', {notice:{title:'MUA XU',text:'Số dư không khả dụng.!!'}});
			}else{
				var xu = red*3;
				tab_UserInfo.findOneAndUpdate({id: client.UID}, {$inc:{red:-red, xu:xu}}, function(err, cat){
					client.emit('p', {shop:{mua_xu:{status:200, text:'Mua Xu thành công.!!'}},user:{red:cat.red-red, xu:cat.xu+xu}});
				});
				tab_MuaXu.create({'uid':client.UID, 'red':red, 'xu':xu, 'time': new Date()});
			}
		});
	}
}
