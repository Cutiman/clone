const User      = require('./Controllers/User.js')
const onPost    = require('./Controllers/onPost.js')
const GameState = require('./Controllers/GameState.js')

module.exports = function(client) {
	client.gameEvent = {}

	User.first(client, 'name exp phone red xu ketSat lastDate regDate')
	GameState(client)

	client.on('p', function(p){
		if (typeof p === "object") onPost(client, p)
	})
}
