
const UserInfo = require('../Models/UserInfo')
const GiftCode = require('../Models/GiftCode');
const Helpers  = require('../Helpers/Helpers')

module.exports = function(client, code){
	GiftCode.findOne({'code': code}, {}, function(err, db) {
		if (!!db) {
			var d1 = Date.parse(new Date());
			var d2 = Date.parse(db.todate);
			if (d2>d1) {
				if (void 0 !== db.uid) {
					client.emit('p', {notice:{title:'GIFTCODE',text:'Mã Gift đã qua sử dụng.' + "\n" + ' Hãy thử một mã khác...'}});
				}else{
					if (Helpers.isEmpty(db.type)) {
						GiftCode.findOneAndUpdate({'_id': db._id}, {$set:{uid: client.UID}}).exec();
						UserInfo.findOneAndUpdate({id: client.UID}, {$inc:{red:db.red, xu:db.xu}}).exec(function(err, data){
							client.emit('p', {notice:{title:'GIFTCODE',text:'Bạn nhận được: ' + (db.red > 0 ? Helpers.numberToBet(db.red) + ' RED' : '') + (db.xu > 0 ? (db.red > 0 ? ' và ' : '') + Helpers.numberToBet(db.xu) + ' XU' : '')}, user:{red:data.red+db.red, xu:data.xu+db.xu}});
						});
					}else{
						GiftCode.findOne({'uid': client.UID, 'type': db.type}, 'code', function(err, check) {
							if (!!check) {
								client.emit('p', {notice:{title:'GIFTCODE',text:'Bạn đã từng sử dụng họ Gift này trước đây...!!'}});
							}else{
								GiftCode.findOneAndUpdate({'_id': db._id}, {$set:{uid: client.UID}}).exec();
								UserInfo.findOneAndUpdate({id: client.UID}, {$inc:{red:db.red, xu:db.xu}}).exec(function(err, data){
									client.emit('p', {notice:{title:'GIFTCODE',text:'Bạn nhận được: ' + (db.red > 0 ? Helpers.numberToBet(db.red) + ' RED' : '') + (db.xu > 0 ? (db.red > 0 ? ' và ' : '') + Helpers.numberToBet(db.xu) + ' XU' : '')}, user:{red:data.red+db.red, xu:data.xu+db.xu}});
								});
							}
						})
					}
				}
			}else{
				client.emit('p', {notice:{title:'GIFTCODE',text:'Mã Gift Đã hết hạn...!!'}});
			}
		}else{
			client.emit('p', {notice:{title:'GIFTCODE',text:'Mã Gift không tồn tại...!!'}});
		}
	})
}
