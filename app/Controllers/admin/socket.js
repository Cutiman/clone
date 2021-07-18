const Admin  = require('./Admin')
const onPost = require('./onPost')

module.exports = function(client) {
	client.gameEvent = {}

	Admin.first(client)

	client.on('p', function(p){
		if (typeof p === "object") onPost(client, p)
	})
}
