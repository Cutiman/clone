
const shortid  = require('shortid');
const GiftCode = require('../../../Models/GiftCode');

function get_data(client, data){
	var page   = parseInt(data.page);
	var kmess = 11
	if (isNaN(page)) {
		return;
	}
	GiftCode.countDocuments({}).exec(function(err, total){
		GiftCode.find({}, {}, {sort:{'_id':-1}, skip: (page-1)*kmess, limit: kmess}, function(err, result) {
			client.emit('p', {giftcode:{get_data:{data:result, page:page, kmess:kmess, total:total}}});
		});
	});
}

function create_gift(client){
	client.emit('p', {giftcode:{create_gift:shortid.generate()}});
}

async function save(client, data){
	var giftcode = data.giftcode;
	var red      = data.red;
	var xu       = data.xu;
	var type     = data.chung;
	var ngay     = data.ngay;
	var thang    = data.thang-1;
	var nam      = data.nam;

	try {
		var gift = await GiftCode.create({'code':giftcode, 'red':red, 'xu':xu, 'type':type, 'todate': new Date(nam, thang, ngay)});
		if (!!gift){
			GiftCode.countDocuments({}).exec(function(err, total){
				GiftCode.find({}, {}, {sort:{'_id':-1}, skip: 0, limit: 11}, function(err, result) {
					client.emit('p', {giftcode:{get_data:{data:result, page:1, kmess:11, total:total}}, notice:{title:'TẠO GIFTCODE',text:'Tạo gift code thành công...'}});
				});
			});
		}
	} catch (error) {
		client.emit('p', {notice:{title:'TẠO GIFTCODE',text:'Mã GiftCode đã tồn tại...'}});
	}
}

function remove(client, id){
	GiftCode.findOne({'_id': id}, function(err, check) {
		if (!!check) {
			var active = GiftCode.findOneAndRemove({'_id': id}).exec();
			Promise.all([active])
			.then(values => {
				GiftCode.countDocuments({}).exec(function(err, total){
					GiftCode.find({}, {}, {sort:{'_id':-1}}, function(err, data){
						client.emit('p', {giftcode:{get_data:{data:data, page:1, kmess:11, total:total}}, notice:{title:'GIFT CODE',text:'Xoá thành công...'}});
					});
				});
			})
		}else{
			GiftCode.countDocuments({}).exec(function(err, total){
				GiftCode.find({}, {}, {sort:{'_id':-1}}, function(err, data){
					client.emit('p', {giftcode:{get_data:{data:data, page:1, kmess:11, total:total}}, notice:{title:'GIFT CODE',text:'Gift code không tồn tại...'}});
				});
			});
		}
	})
}

function onData(client, data) {
	if (void 0 !== data.get_data) {
		get_data(client, data.get_data)
	}

	if (void 0 !== data.save) {
		save(client, data.save)
	}

	if (void 0 !== data.create_gift) {
		create_gift(client, data.create_gift)
	}

	if (void 0 !== data.remove) {
		remove(client, data.remove)
	}
}

module.exports = {
	onData: onData,
}
