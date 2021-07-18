
const NapThe   = require('../../../Models/NapThe');
const UserInfo = require('../../../Models/UserInfo');

function get_data(client, data){
	var status = parseInt(data.status)
	var page   = parseInt(data.page);
	var kmess = 11

	if (isNaN(status) || isNaN(page)) {
		return;
	}
	if (status == -1) {
		NapThe.estimatedDocumentCount().exec(function(err, total){
			NapThe.find({}, {}, {sort:{'_id':-1}, skip: (page-1)*kmess, limit: kmess}, function(err, result) {
				client.emit('p', {nap_the:{get_data:{data:result, page:page, kmess:kmess, total:total}}});
			});
		});
	}else{
		NapThe.countDocuments({status: status}).exec(function(err, total){
			NapThe.find({status: status}, {}, {sort:{'_id':-1}, skip: (page-1)*kmess, limit: kmess}, function(err, result) {
				client.emit('p', {nap_the:{get_data:{data:result, page:page, kmess:kmess, total:total}}});
			});
		});
	}
}

function set_data(client, data){
	var status = parseInt(data.status)
	var nhan   = parseInt(data.nhan);
	var id     = data.id

	if (isNaN(status) || isNaN(nhan)) {
		return;
	}

	NapThe.findOne({'_id': id}, 'name nhan', function(err, check){
		if (check) {
			var bet = nhan-check.nhan
			var betUser = bet-check.nhan
			NapThe.findOneAndUpdate({'_id': id}, {nhan: bet, status: status}, function(err, cat){
				var temp = cat;
				temp.nhan   = bet
				temp.status = status

				client.emit('p', {nap_the:{set_data:temp}});
			});
			if (betUser != 0) {
				UserInfo.findOneAndUpdate({name: check.name}, {$inc:{red:betUser}}, function(err,cat){});
			}
		}
	})
}

function onData(client, data) {
	if (void 0 !== data.get_data) {
		get_data(client, data.get_data)
	}
	if (void 0 !== data.set_data) {
		set_data(client, data.set_data)
	}
}

module.exports = {
	onData: onData,
}
