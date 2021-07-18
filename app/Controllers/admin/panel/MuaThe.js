
const MuaThe      = require('../../../Models/MuaThe');
const MuaThe_card = require('../../../Models/MuaThe_card');

function get_data(client, data){
	var status = parseInt(data.status)
	var page   = parseInt(data.page);
	var kmess = 11

	if (isNaN(status) || isNaN(page)) {
		return;
	}
	if (status == -1) {
		MuaThe.estimatedDocumentCount().exec(function(err, total){
			MuaThe.find({}, {}, {sort:{'_id':-1}, skip: (page-1)*kmess, limit: kmess}, function(err, result) {
				var a = Promise.all(result.map(function(obj){
					return MuaThe_card.find({'cart': obj._id})
				}))
				a.then(function(data){
					client.emit('p', {mua_the:{get_data:{data:result, card: data, page:page, kmess:kmess, total:total}}});
				})
			});
		});
	}else{
		MuaThe.countDocuments({status: status}).exec(function(err, total){
			MuaThe.find({status: status}, {}, {sort:{'_id':-1}, skip: (page-1)*kmess, limit: kmess}, function(err, result) {
				var a = Promise.all(result.map(function(obj){
					return MuaThe_card.find({'cart': obj._id})
				}))
				a.then(function(data){
					client.emit('p', {mua_the:{get_data:{data:result, card: data, page:page, kmess:kmess, total:total}}});
				})
			});
		});
	}
}

function set_data(client, data){
	var status = parseInt(data.status);
	var card   = data.data;
	var id     = data.id;
	var active1 = new Promise(function(resolve, reject){
		MuaThe.findOneAndUpdate({'_id': id}, {$set:{status: status}}, function(err, cart){
			var temp    = cart;
			temp.status = status
	    	resolve(temp);
		});
	})
	var active2 = Promise.all(card.map(function(obj){
		return MuaThe_card.findOneAndUpdate({'_id': obj._id}, {$set:{maThe: obj.maThe, seri: obj.seri, time: obj.time}}, function(err, cart){
				var temp   = cart;
				temp.maThe = obj.maThe
				temp.seri  = obj.seri
				temp.time  = obj.time
				return temp
			});
	}))
	Promise.all([active1, active2]).then(values => {
		client.emit('p', {mua_the:{set_data:{cart: values[0], card: values[1]}}});
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
