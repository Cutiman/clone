
const Users    = require('../../../Models/Users');
const UserInfo = require('../../../Models/UserInfo');

const Helper   = require('../../../Helpers/Helpers');

function get_users(client, data){
	var page  = Math.abs(parseInt(data.page));
	var kmess = 11

	if (!isNaN(page) && page > 0) {
		if (void 0 === data.find) {
			UserInfo.estimatedDocumentCount().exec(function(err, total){
				UserInfo.find({}, {}, {sort:{'UID':-1}, skip: (page-1)*kmess, limit: kmess}, function(err, result) {
					if (result.length) {
						Promise.all(result.map(function(obj){
							return new Promise(function(resolve, reject) {
								Users.findOne({'_id': obj.id}, function(error, result2){
									var temp = obj._doc
									temp['username'] = result2.local.username;
									resolve(temp)
								})
							})
						}))
						.then(function(data){
							client.emit('p', {users:{get_users:{data:data, page:page, kmess:kmess, total:total}}});
						})
					}else{
						client.emit('p', {users:{get_users:{data:[], page:1, kmess:11, total:0}}});
					}
				});
			});
		}else{
			var find = data.find;
			if (find.length) {
				var regex = new RegExp("" + data.find + "", "i");
				UserInfo.countDocuments({"name": {$regex: regex}}).exec(function(err, total){
					UserInfo.find({"name": {$regex: regex}}, {}, {sort:{'UID':-1}, skip: (page-1)*kmess, limit: kmess}, function(err, result) {
						if (result.length) {
							Promise.all(result.map(function(obj){
								return new Promise(function(resolve, reject) {
									Users.findOne({'_id': obj.id}, function(error, result2){
										var temp = obj._doc
										temp['username'] = result2.local.username;
										resolve(temp)
									})
								})
							}))
							.then(function(data){
								client.emit('p', {users:{get_users:{data:data, page:page, kmess:kmess, total:total}}});
							})
						}else{
							client.emit('p', {users:{get_users:{data:[], page:1, kmess:11, total:0}}});
						}
					});
				});
			}
		}
	}
}

function updatePass(client, data){
	var id = data.id;
	var error = null;
	if (data.newPassword.length > 32 || data.newPassword.length < 5 || data.newPassword2.length > 32 || data.newPassword2.length < 5)
		error = 'Mật khẩu từ 5 - 32 kí tự...';
	else if (data.newPassword != data.newPassword2)
		error = 'Nhập lại mật khẩu không đúng...';

	if (error) {
		client.emit('p', {notice:{title:'ĐỔI MẬT KHẨU', text:error}});
		return;
	}

	UserInfo.findOne({'_id': id}, function(err, check) {
		if (check) {
			Users.findOneAndUpdate({'_id': id}, {$set:{'local.password':Helper.generateHash(data.newPassword)}}, function(err, cart){
				client.emit('p', {notice:{title:'ĐỔI MẬT KHẨU', text:'Đổi mật khẩu thành công.'}});
			})
		}else{
			client.emit('p', {notice:{title:'ĐỔI MẬT KHẨU', text:'Người dùng không tồn tại...'}});
		}
	})
}

function updateRed(client, data){
	var id = data.id;
	var red = parseInt(data.newRED);
	if (isNaN(red)) {
		client.emit('p', {notice:{title:'CẬP NHẬT RED', text:'Lỗi dữ liệu...'}});
		return;
	}

	UserInfo.findOne({'_id': id}, function(err, check) {
		if (check) {
			UserInfo.findOneAndUpdate({'_id': id}, {$set:{red: red}}, function(err, cart){
				var temp = cart._doc
				temp['red'] = red;
				Users.findOne({'_id': temp.id}, function(error, result2){
					temp['username'] = result2.local.username;
					client.emit('p', {users:{update:temp}});
				})
			})
		}else{
			client.emit('p', {notice:{title:'CẬP NHẬT RED', text:'Người dùng không tồn tại...'}});
		}
	})
}

function updateXu(client, data){
	var id = data.id;
	var xu = parseInt(data.newXu);
	if (isNaN(xu)) {
		client.emit('p', {notice:{title:'CẬP NHẬT XU', text:'Lỗi dữ liệu...'}});
		return;
	}

	UserInfo.findOne({'_id': id}, function(err, check) {
		if (check) {
			UserInfo.findOneAndUpdate({'_id': id}, {$set:{xu: xu}}, function(err, cart){
				var temp = cart._doc
				temp['xu'] = xu;
				Users.findOne({'_id': temp.id}, function(error, result2){
					temp['username'] = result2.local.username;
					client.emit('p', {users:{update:temp}});
				})
			})
		}else{
			client.emit('p', {notice:{title:'CẬP NHẬT XU', text:'Người dùng không tồn tại...'}});
		}
	})
}
function onData(client, data) {
	if (void 0 !== data.get_users) {
		get_users(client, data.get_users)
	}
	if (void 0 !== data.updatePass) {
		updatePass(client, data.updatePass)
	}
	if (void 0 !== data.updateRed) {
		updateRed(client, data.updateRed)
	}
	if (void 0 !== data.updateXu) {
		updateXu(client, data.updateXu)
	}
	
}

module.exports = {
	onData: onData,
}
