
const tabDaiLy = require('../../Models/DaiLy');
module.exports = function(client){
	tabDaiLy.find({}, function(err, daily){
		client.emit('p', {shop:{daily:daily}});
	});
}
