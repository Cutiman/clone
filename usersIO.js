
const socketioAuth = require("socketio-auth");
const User         = require('./app/Models/Users');

const helpers      = require('./app/Helpers/Helpers');

// Authenticate!
const authenticate = async function(client, data, callback) {
	var { username, password, register } = data;
	username = username.trim();
	password = password.trim();
	if (username.length > 32 || username.length < 5 || password.length > 32 || password.length < 5){
		callback({message:'Thông tin Sai! (5-32 kí tự)'});
		return;
	}
	if (username.match(new RegExp("^[a-zA-Z0-9]+$")) === null) {
		callback({message:'Tên chỉ gồm kí tự và số !!'});
		return;
	};

	try {
		var regex = new RegExp("^" + username + "$", 'i')
		if (register) {
			if (username == password){
				callback({message:'Mật khẩu không được trùng với tài khoản !!'});
				return;
			}

			User.findOne({'local.username': {$regex: regex}}).exec(async function(err, check){
				if (!!check){
					callback({message: 'Tên tài khoản đã tồn tại !!'}, false);
				}else{
					var user = await User.create({'local.username':username, 'local.password':helpers.generateHash(password), 'local.regDate': new Date()});
					if (!!user){
						client.UID = user._id;
						callback(null, true);
					}else
						callback({message: 'Tên tài khoản đã tồn tại !!'}, false);
				}
			});
		} else {
			var user = await User.findOne({'local.username': {$regex: regex}});
			if (user){
				if (user.validPassword(password)){
					client.UID = user._id;
					callback(null, true);
				} else
					callback({message: 'Sai mật khẩu!!'}, false);
			} else
				callback({message: 'Tài khoản không tồn tại!!'}, false);
		}
	} catch (error) {
		console.log(error)
		callback({message: error});
	}
};
// Register Actions
const postAuthenticate = function(client) {
	if (client.auth && client.UID) {
		require('./app/socket.js')(client);
	}
};

const disconnect = function(client){
	client.auth = false;
	client.UID  = null;
}

module.exports = function(io){
	socketioAuth(io, { authenticate, postAuthenticate, disconnect, timeout: "none" })
}
