
const mini_poker    = require('./game/mini_poker');

module.exports = function(client, data){
	if (client.auth && client.UID) {
		if (void 0 !== data.mini_poker) {
			mini_poker(client, data.mini_poker);
		}
	}
}
