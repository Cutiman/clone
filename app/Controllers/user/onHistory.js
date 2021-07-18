
const NapThe      = require('../../Models/NapThe');

const MuaThe      = require('../../Models/MuaThe');
const MuaThe_card = require('../../Models/MuaThe_card');

const MuaXu       = require('../../Models/MuaXu');
const ChuyenRed   = require('../../Models/ChuyenRed');

const Helper      = require('../../Helpers/Helpers');

function historyNapRed(client, data){
	var page  = Math.abs(parseInt(data.page))
	var kmess = 8
	if (!isNaN(page) && page > 0) {
		NapThe.countDocuments({uid: client.UID}).exec(function(err, total){
			NapThe.find({uid: client.UID}, {}, {sort:{'_id':-1}, skip: (page-1)*kmess, limit: kmess}, function(err, result) {
				client.emit('p', {profile:{history:{nap_red:{data:result, page:page, kmess:kmess, total:total}}}});
			});
		});
	}
}

function historyMuaThe(client, data){
	var page  = Math.abs(parseInt(data.page))
	var kmess = 8
	if (!isNaN(page) && page > 0) {
		MuaThe.countDocuments({uid: client.UID}).exec(function(err, total){
			MuaThe.find({uid: client.UID}, {}, {sort:{'_id':-1}, skip: (page-1)*kmess, limit: kmess}, function(err, result) {
				var a = Promise.all(result.map(function(obj){
					return MuaThe_card.find({'cart': obj._id})
				}))
				a.then(function(data){
					client.emit('p', {profile:{history:{mua_the:{data:result, card: data, page:page, kmess:kmess, total:total}}}});
				})
			});
		});
	}
}

function historyMuaXu(client, data){
	var page  = Math.abs(parseInt(data.page))
	var kmess = 8
	if (!isNaN(page) && page > 0) {
		MuaXu.countDocuments({uid: client.UID}).exec(function(err, total){
			MuaXu.find({uid: client.UID}, {}, {sort:{'_id':-1}, skip: (page-1)*kmess, limit: kmess}, function(err, result) {
				client.emit('p', {profile:{history:{mua_xu:{data:result, page:page, kmess:kmess, total:total}}}});
			});
		});
	}
}

function historyChuyenRed(client, data){
	var page  = Math.abs(parseInt(data.page))
	var kmess = 8
	if (!isNaN(page) && page > 0) {
		var regex = new RegExp("^" + client.profile.name + "$", 'i')
		ChuyenRed.countDocuments({$or:[{'from':{$regex: regex}}, {'to':{$regex: regex}}]}).exec(function(err, total){
			ChuyenRed.find({$or:[{'from':{$regex: regex}}, {'to':{$regex: regex}}]}, {}, {sort:{'_id':-1}, skip: (page-1)*kmess, limit: kmess}, function(err, result) {
				client.emit('p', {profile:{history:{chuyen_red:{data:result, page:page, kmess:kmess, total:total}}}});
			});
		});
	}
}

function historyChoiGame(client, data){
}

function onHistory(client, data) {
	if (void 0 !== data.nap_red) {
		historyNapRed(client, data.nap_red)
	}

	if (void 0 !== data.mua_the) {
		historyMuaThe(client, data.mua_the)
	}

	if (void 0 !== data.mua_xu) {
		historyMuaXu(client, data.mua_xu)
	}

	if (void 0 !== data.chuyen_red) {
		historyChuyenRed(client, data.chuyen_red)
	}

	if (void 0 !== data.choi_game) {
		historyChoiGame(client, data.choi_game)
	}
}

module.exports = onHistory;