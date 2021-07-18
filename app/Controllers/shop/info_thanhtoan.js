
const NhaMang = require('../../Models/NhaMang');
const MenhGia = require('../../Models/MenhGia');

module.exports = function(client, nap = 0){
	if (!!nap) {
		var find = {nap: true};
	}else{
		var find = {mua: true};
	}
	var active1 = NhaMang.find(find).exec();
	var active2 = MenhGia.find(find).exec();

	Promise.all([active1, active2])
	.then(function(values){
		var data = {nhamang: values[0], menhgia: values[1]}
		if (!!nap) {
			client.emit('p', {shop:{info_nap: data}});
		}else{
			client.emit('p', {shop:{info_mua: data}});
		}
	})
}
