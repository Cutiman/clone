
const Admin  = require('../../Models/Admin');

const Helper = require('../../Helpers/Helpers');

function first(client) {
	Admin.findOne({_id: client.UID}, function (err, d) {
		client.emit('p', {
			first: {username: d.username, rights: d.rights },
			taixiu: {time_remain: client.server.TaiXiu_time}
		});
	});
}

function changePassword(client, data){
	var error = null;
	if (data.password.length > 32 || data.password.length < 5 || data.newPassword.length > 32 || data.newPassword.length < 5 || data.newPassword2.length > 32 || data.newPassword2.length < 5)
		error = 'Mật khẩu từ 5 - 32 kí tự...';
	else if (data.newPassword != data.newPassword2)
		error = 'Nhập lại mật khẩu không đúng...';

	if (error) {
		client.emit('p', {admin:{doi_pass:{status:300, text:error}}});
		return;
	}

	Admin.findOne({'_id': client.UID}, function(err, user){
		if (user !== null) {
			if (Helper.validPassword(data.password, user.password)) {
				Admin.findOneAndUpdate({'_id': client.UID}, {'password':Helper.generateHash(data.newPassword)}, function(err, cat){
					client.emit('p', {admin:{doi_pass:{status:200, text:'Đổi mật khẩu thành công.'}}});
				});
			}else{
				client.emit('p', {admin:{doi_pass:{status:300, text:'Mật khẩu cũ không đúng.'}}});
			}
		}
	});
}

function onData(client, data) {
	if (void 0 !== data.doi_pass) {
		changePassword(client, data.doi_pass)
	}
}

module.exports = {
	first: first,
	onData: onData,
}
