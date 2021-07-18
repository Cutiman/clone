
const socketioAuth = require("socketio-auth");
const Admin        = require('./app/Models/Admin');

// Authenticate!
const authenticate = async function(client, data, callback) {
	var { username, password } = data;
	username = username.trim();
	password = password.trim();
	if (username.length > 32 || username.length < 5 || password.length > 32 || password.length < 5){
		callback({message:{code: 1, errmsg: 'Thông tin Sai! (5-32 kí tự)'}});
		return;
	}
	if (username.match(new RegExp("^[a-zA-Z0-9]+$")) === null) {
		callback({message:{code: 2, errmsg: 'Tên chỉ gồm kí tự và số!'}});
		return;
	};

	try {
		var regex = new RegExp("^" + username + "$", 'i')
		var user = await Admin.findOne({'username': {$regex: regex}});
		if (user){
			if (user.validPassword(password)){
				client.UID    = user._id;
				client.rights = user.rights;
				callback(null, true);
			} else
				callback({message: 'Sai mật khẩu!!'}, false);
		} else
			callback({message: 'Tài khoản không tồn tại!!'}, false);
	} catch (error) {
		console.log(error)
		callback({message: error});
	}
};

// Register Actions
const postAuthenticate = function(client) {
	if (client.auth && client.UID) {
		require('./app/Controllers/admin/socket.js')(client);
	}
};

const disconnect = function(client){
	client.auth = false;
	client.UID  = null;
}

module.exports = function(io){
	socketioAuth(io, { authenticate, postAuthenticate, disconnect, timeout: "none" })
}
