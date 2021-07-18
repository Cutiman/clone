
const tabDaiLy   = require('../../../Models/DaiLy');
const tabNhaMang = require('../../../Models/NhaMang');
const tabMenhGia = require('../../../Models/MenhGia');

const Helper     = require('../../../Helpers/Helpers');

async function DaiLy_add(client, data){
	var name     = data.name;
	var nickname = data.nickname;
	var phone    = data.phone;
	var fb       = data.fb;
	if (Helper.isEmpty(name) || Helper.isEmpty(nickname) || Helper.isEmpty(phone) || Helper.isEmpty(fb)) {
		client.emit('p', {notice:{title:'ĐẠI LÝ',text:'Không bỏ trống các thông tin...'}});
	}else{

		try {
			const create = await tabDaiLy.create({'name':name, 'nickname':nickname, 'phone':phone, 'fb':fb});
			if (!!create) {
				tabDaiLy.find({}, {}, {sort:{'_id':-1}}, function(err, data){
					client.emit('p', {daily:data, notice:{title:'ĐẠI LÝ',text:'Thêm đại lý thành công...'}});
				});
			}
		} catch (err) {
			client.emit('p', {notice:{title:'ĐẠI LÝ',text:'Có lỗi sảy ra, xin vui lòng thử lại.'}});
		}
	}
}

function DaiLy_remove(client, id){
	tabDaiLy.findOne({'_id': id}, function(err, data){
		if (data) {
			var active = tabDaiLy.findOneAndRemove({'_id': id}).exec();
			Promise.all([active])
			.then(values => {
				tabDaiLy.find({}, {}, {sort:{'_id':-1}}, function(err, data){
					client.emit('p', {daily:data, notice:{title:'ĐẠI LÝ',text:'Xoá thành công...'}});
				});
			})
		}else{
			tabDaiLy.find({}, {}, {sort:{'_id':-1}}, function(err, data){
				client.emit('p', {daily:data, notice:{title:'ĐẠI LÝ',text:'Đại lý không tồn tại...'}});
			});
		}
	});
}

function DaiLy_get(client){
	tabDaiLy.find({}, {}, {sort:{'_id':-1}}, function(err, data){
		client.emit('p', {daily:data});
	});
}

function DaiLy(client, data){
	if (void 0 !== data.add) {
		DaiLy_add(client, data.add)
	}
	if (void 0 !== data.remove) {
		DaiLy_remove(client, data.remove)
	}
	if (void 0 !== data.get_data) {
		DaiLy_get(client)
	}
}



async function NhaMang_add(client, data){
	var name = data.name;
	var nap  = !!data.nap;
	var mua  = !!data.mua;
	if (Helper.isEmpty(name) || (!nap && !mua)) {
		client.emit('p', {notice:{title:'THÊM NHÀ MẠNG',text:'Không bỏ trống các thông tin...'}});
	}else{
		try {
			const create = await tabNhaMang.create({'name':name, 'nap':nap, 'mua':mua});
			if (!!create) {
				tabNhaMang.find({}, function(err, data){
					client.emit('p', {thecao:{nhamang:data}, notice:{title:'THÊM NHÀ MẠNG',text:'Thêm NHÀ MẠNG thành công...'}});
				});
			}
		} catch (err) {
			client.emit('p', {notice:{title:'THÊM NHÀ MẠNG',text:'Có lỗi sảy ra, xin vui lòng thử lại.'}});
		}
	}
}
function NhaMang_remove(client, id){
	tabNhaMang.findOne({'_id': id}, function(err, check){
		if (check) {
			var active = tabNhaMang.findOneAndRemove({'_id': id}).exec();
			Promise.all([active])
			.then(values => {
				tabNhaMang.find({}, function(err, data){
					client.emit('p', {thecao:{nhamang:data}, notice:{title:'XOÁ NHÀ MẠNG',text:'Xoá thành công...'}});
				});
			})
		}else{
			tabNhaMang.find({}, function(err, data){
				client.emit('p', {thecao:{nhamang:data}, notice:{title:'XOÁ NHÀ MẠNG',text:'Nhà mạng không tồn tại...'}});
			});
		}
	});
}
function NhaMang_get(client){
	tabNhaMang.find({}, function(err, data){
		client.emit('p', {thecao:{nhamang:data}});
	});
}

function NhaMang(client, data){
	if (void 0 !== data.add) {
		NhaMang_add(client, data.add)
	}
	if (void 0 !== data.remove) {
		NhaMang_remove(client, data.remove)
	}
	if (void 0 !== data.get_data) {
		NhaMang_get(client)
	}
}

async function MenhGia_add(client, data){
	var name   = data.name;
	var values = data.values;
	var nap    = !!data.nap;
	var mua    = !!data.mua;
	if (Helper.isEmpty(name) || Helper.isEmpty(values) || (!nap && !mua)) {
		client.emit('p', {notice:{title:'THÊM MỆNH GIÁ',text:'Không bỏ trống các thông tin...'}});
	}else{
		try {
			const create = await tabMenhGia.create({'name':name, 'values':values, 'nap':nap, 'mua':mua});
			if (!!create) {
				tabMenhGia.find({}, function(err, data){
					client.emit('p', {thecao:{menhgia:data}, notice:{title:'THÊM MỆNH GIÁ',text:'Thêm MỆNH GIÁ thành công...'}});
				});
			}
		} catch (err) {
			client.emit('p', {notice:{title:'THÊM MỆNH GIÁ',text:'Có lỗi sảy ra, xin vui lòng thử lại.'}});
		}
	}
}
function MenhGia_remove(client, id){
	tabMenhGia.findOne({'_id': id}, function(err, check){
		if (check) {
			var active = tabMenhGia.findOneAndRemove({'_id': id}).exec();
			Promise.all([active])
			.then(values => {
				tabMenhGia.find({}, function(err, data){
					client.emit('p', {thecao:{menhgia:data}, notice:{title:'XOÁ MỆNH GIÁ',text:'Xoá thành công...'}});
				});
			})
		}else{
			tabMenhGia.find({}, function(err, data){
				client.emit('p', {thecao:{menhgia:data}, notice:{title:'XOÁ MỆNH GIÁ',text:'Mệnh giá không tồn tại...'}});
			});
		}
	});
}
function MenhGia_get(client){
	tabMenhGia.find({}, function(err, data){
		client.emit('p', {thecao:{menhgia:data}});
	});
}

function MenhGia(client, data){
	if (void 0 !== data.add) {
		MenhGia_add(client, data.add)
	}
	if (void 0 !== data.remove) {
		MenhGia_remove(client, data.remove)
	}
	if (void 0 !== data.get_data) {
		MenhGia_get(client)
	}
}

function onData(client, data) {
	if (void 0 !== data.daily) {
		DaiLy(client, data.daily)
	}
	if (void 0 !== data.nhamang) {
		NhaMang(client, data.nhamang)
	}
	if (void 0 !== data.menhgia) {
		MenhGia(client, data.menhgia)
	}
}

module.exports = {
	onData: onData,
}
