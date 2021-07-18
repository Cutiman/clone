
const User        = require('../Models/Users');
const UserInfo    = require('../Models/UserInfo');
const TaiXiu_User = require('../Models/TaiXiu_user');
const Helper      = require('../Helpers/Helpers');
const onHistory   = require('./user/onHistory');

const first = function(client, select){
	UserInfo.findOne({ id: client.UID }, function (err, d) {
		if (d !== null) {
			client.profile = d
		}
		client.emit('p', {
			first: d || {}
		});
	});
}

const signName = function(client, name){
	let userName = name.trim();
	let error = null;
	if (userName.length > 13 || userName.length < 3){
		error = 'Độ dài từ 3 đến 13 ký tự !!';
	}else if (userName.match(new RegExp("^[a-zA-Z0-9]+$")) === null){
		error = 'Tên không chứa ký tự đặc biệt !!';
	};
	if (error) {
		client.emit('p', {
			error: error
		});
		return;
	}
	UserInfo.findOne({id: client.UID}, function(err, d){
		if (d == null) {
			var regex = new RegExp("^" + name + "$", 'i')
			UserInfo.findOne({'name': {$regex: regex}}, async function(err, check){
				if (!!check) {
					client.emit('p', {error: "Tên nhân vật đã tồn tại.@@"});
				}else{
					try {
						const user = await UserInfo.create({'id':client.UID, 'name':name, 'joinedOn':new Date()});
						if (!!user) {
							first(client, 'select');
							TaiXiu_User.create({'uid':client.UID});
						}
					} catch (err) {
						client.emit('p', {
							error: "Tên nhân vật đã tồn tại.@@"
						});
					}
				}
			})
		}else{
			client.emit('p', {
				first: d
			});
		}
	});
}

function changePassword(client, data){
	var error = null;
	if (data.passOld.length > 32 || data.passOld.length < 5 || data.passNew.length > 32 || data.passNew.length < 5 || data.passNew2.length > 32 || data.passNew2.length < 5)
		error = 'Mật khẩu từ 5 - 32 kí tự.';
	else if (data.passNew != data.passNew2)
		error = 'Nhập lại mật khẩu không đúng!!';

	if (error) {
		client.emit('p', {profile:{changePassword:{status:300, text:error}}});
		return;
	}

	User.findOne({'_id': client.UID}, function(err, user){
		if (user !== null) {
			if (Helper.validPassword(data.passOld, user.local.password)) {
				User.findOneAndUpdate({'_id': client.UID}, {'local.password':Helper.generateHash(data.passNew)}, function(err, cat){
					client.emit('p', {profile:{changePassword:{status:200, text:'Đổi mật khẩu thành công.'}}});
				});
			}else{
				client.emit('p', {profile:{changePassword:{status:300, text:'Mật khẩu cũ không đúng.'}}});
			}
		}
	});
}

function onData(client, data) {
	if (void 0 !== data.doi_pass) {
		changePassword(client, data.doi_pass)
	}
	if (void 0 !== data.history) {
		onHistory(client, data.history)
	}
}

module.exports = {
	first:    first,
	signName: signName,
	onData:   onData,
}
