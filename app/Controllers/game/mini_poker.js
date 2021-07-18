
const miniPokerHu  = require('../../Models/miniPoker/miniPokerHu');
const miniPokerTop = require('../../Models/miniPoker/miniPokerTop');

const miniPoker100R = require('../../Models/miniPoker/miniPoker100R');
const miniPoker1kR  = require('../../Models/miniPoker/miniPoker1kR');
const miniPoker10kR = require('../../Models/miniPoker/miniPoker10kR');

const miniPoker100X = require('../../Models/miniPoker/miniPoker100X');
const miniPoker1kX  = require('../../Models/miniPoker/miniPoker1kX');
const miniPoker10kX = require('../../Models/miniPoker/miniPoker10kX');

const UserInfo  = require('../../Models/UserInfo');
const Helpers   = require('../../Helpers/Helpers');
const base_card = require('../../../data/card');
const base_hu   = require('../../../data/miniPoker_hu');

function info(client, data){
	var bet = Math.abs(parseInt(data.cuoc)); // Mức cược
	var red = !!data.red; // Loại tiền (Red: true, Xu: false)
	if (isNaN(bet) || !(bet == 100 || bet == 1000 || bet == 10000)) {
		client.emit('p', {mini:{poker:{status:0}}, notice:{text: "DỮ LIỆU KHÔNG ĐÚNG...", title: "MINI POKER"}});
	}else{
		var phien = 0;
		if (red) {
			if (bet == 100) {
				miniPoker100R.findOne({}, 'id', {sort:{'id':-1}}, function(err, last) {
					if (!!last){
						phien = last.id+1;
					}else{
						phien = 1;
					}
					miniPokerHu.findOne({type:bet, red:red}, {}, function(err, data){
						client.emit('p', {mini:{poker:{hu: data.bet, phien: phien}}});
					});
				})
			}else if (bet == 1000) {
				miniPoker1kR.findOne({}, 'id', {sort:{'id':-1}}, function(err, last) {
					if (!!last){
						phien = last.id+1;
					}else{
						phien = 1;
					}
					miniPokerHu.findOne({type:bet, red:red}, {}, function(err, data){
						client.emit('p', {mini:{poker:{hu: data.bet, phien: phien}}});
					});
				})
			}else{
				miniPoker10kR.findOne({}, 'id', {sort:{'id':-1}}, function(err, last) {
					if (!!last){
						phien = last.id+1;
					}else{
						phien = 1;
					}
					miniPokerHu.findOne({type:bet, red:red}, {}, function(err, data){
						client.emit('p', {mini:{poker:{hu: data.bet, phien: phien}}});
					});
				})
			}
		}else{
			if (bet == 100) {
				miniPoker100X.findOne({}, 'id', {sort:{'id':-1}}, function(err, last) {
					if (!!last){
						phien = last.id+1;
					}else{
						phien = 1;
					}
					miniPokerHu.findOne({type:bet, red:red}, {}, function(err, data){
						client.emit('p', {mini:{poker:{hu: data.bet, phien: phien}}});
					});
				})
			}else if (bet == 1000) {
				miniPoker1kX.findOne({}, 'id', {sort:{'id':-1}}, function(err, last) {
					if (!!last){
						phien = last.id+1;
					}else{
						phien = 1;
					}
					miniPokerHu.findOne({type:bet, red:red}, {}, function(err, data){
						client.emit('p', {mini:{poker:{hu: data.bet, phien: phien}}});
					});
				})
			}else{
				miniPoker10kX.findOne({}, 'id', {sort:{'id':-1}}, function(err, last) {
					if (!!last){
						phien = last.id+1;
					}else{
						phien = 1;
					}
					miniPokerHu.findOne({type:bet, red:red}, {}, function(err, data){
						client.emit('p', {mini:{poker:{hu: data.bet, phien: phien}}});
					});
				})
			}
		}
	}
}

function spin(client, data){
	var bet = Math.abs(parseInt(data.cuoc)); // Mức cược
	var red = !!data.red; // Loại tiền (Red: true, Xu: false)
	if (isNaN(bet) || !(bet == 100 || bet == 1000 || bet == 10000)) {
		client.emit('p', {mini:{poker:{status:0}}, notice:{text: "DỮ LIỆU KHÔNG ĐÚNG...", title: "MINI POKER"}});
	}else{
		var phien = 0;
		if (red) {
			if (bet == 100) {
				miniPoker100R.findOne({}, 'id', {sort:{'id':-1}}, function(err, last) {
					if (!!last){
						phien = last.id+1;
					}else{
						phien = 1;
					}
				})
			}else if (bet == 1000) {
				miniPoker1kR.findOne({}, 'id', {sort:{'id':-1}}, function(err, last) {
					if (!!last){
						phien = last.id+1;
					}else{
						phien = 1;
					}
				})
			}else{
				miniPoker10kR.findOne({}, 'id', {sort:{'id':-1}}, function(err, last) {
					if (!!last){
						phien = last.id+1;
					}else{
						phien = 1;
					}
				})
			}
		}else{
			if (bet == 100) {
				miniPoker100X.findOne({}, 'id', {sort:{'id':-1}}, function(err, last) {
					if (!!last){
						phien = last.id+1;
					}else{
						phien = 1;
					}
				})
			}else if (bet == 1000) {
				miniPoker1kX.findOne({}, 'id', {sort:{'id':-1}}, function(err, last) {
					if (!!last){
						phien = last.id+1;
					}else{
						phien = 1;
					}
				})
			}else{
				miniPoker10kX.findOne({}, 'id', {sort:{'id':-1}}, function(err, last) {
					if (!!last){
						phien = last.id+1;
					}else{
						phien = 1;
					}
				})
			}
		}
		UserInfo.findOne({id:client.UID}, red ? 'red name':'xu name', function(err, user){
			if (user === null || (red && user.red < bet) || (!red && user.xu < bet)) {
				client.emit('p', {mini:{poker:{status:0, notice: 'Bạn không đủ ' + (red ? 'RED':'XU') + ' để quay.!!'}}});
			}else{
				var addQuy = Math.floor(bet*0.03);
				miniPokerHu.findOneAndUpdate({type:bet, red:red}, {$inc:{bet:addQuy}}, function(err,cat){});
				var an = 0;
				var code = 0;
				var text = '';
				var thuong = 0;
				var card   = [...base_card.card];
				var lengthC = card.length;
				var ketqua   = [];
				for (var i = 0; i < 5; i++) {
					var random_card = ~~(Math.random()*(lengthC-i));
					ketqua[i] = card[random_card];
					card.splice(random_card,1);
				}

				var length = ketqua.length;
				var type   = ketqua[0].type; // Kiểm tra đồng chất
				var tuQuy  = null;	       // Tên bộ tứ
				var bo2    = 0;            // bộ 2 (có bao nhiêu 2)
				var bo2_a  = [];           // Danh sách tên bộ 2
				var bo3    = false;        // bộ ba (có bao nhiêu bộ 3)
				var bo3_a  = null;         // Tên bộ 3
				var arrT   = [];           // Mảng lọc các bộ 2 trong bài
				for (var i = 0; i < length; i++) {
					var dataT = ketqua[i];
					if (void 0 === arrT[dataT.card]) {
						arrT[dataT.card] = 1;
					}else{
						arrT[dataT.card] += 1;
					}
				}
				arrT.forEach(function(c, index){
					if (c === 4) {
						tuQuy = index;
					}
					if (c === 3) {
						bo3   = true;
						bo3_a = index;
					}
					if (c === 2) {
						bo2++;
						bo2_a[bo2_a.length] = index;
					}
				});

				var dongChat = ketqua.filter(card => card.type == type);
				dongChat = dongChat.length == 5 ? true : false;  // Dây là đồng chất

				var AK   = ketqua.sort(function(a,b){return a.card - b.card});
				var DAK  = AK[4].card - AK[0].card === 4 && bo3 == false && bo2 == 0 && tuQuy == null ? true : false; // Dây từ A đến K
				var DAKj = false

				if (AK[0].card == 0 && bo3 == false && bo2 == 0 && tuQuy == null) {
					var KA = ketqua.sort(function(a,b){
						if (a.card == 0) {
							return 1;
						}else if(b.card == 0) {
							return -1;
						}else{
							return a.card - b.card
						}
					});
					DAKj = KA[3].card == 12 && KA[0].card == 9 ? true : false;
				}

				miniPokerHu.findOne({type:bet, red:red}, {}, function(err, data){
					var quyHu     = data.bet;
					var quyMin    = data.min;
					var checkName = new RegExp("^" + client.profile.name + "$", 'i');
					checkName     = checkName.test(data.name);

					if (checkName || (dongChat && (DAKj || (DAK && AK[4] > 9)))) {
						// NỔ HŨ (DÂY ĐỒNG CHẤT CỦA DÂY ĐẾN J TRỞ LÊN) Hoặc được xác định là nổ hũ
						miniPokerHu.findOneAndUpdate({type:bet, red:red}, {$set:{name:"", bet:quyMin}}, function(err,cat){});
						if (checkName){
							// đặt kết quả thành nổ hũ nếu người chơi được xác định thủ công
							ketqua = base_hu[~~(Math.random()*(base_hu.length-1))];
						}
						an   = quyHu-bet;
						text = 'Nổ Hũ';
						code = 9;
					}else if ((DAK && dongChat) || (DAKj && !dongChat)) {
						// x1000    THÙNG PHÁ SẢNH (DÂY ĐỒNG CHẤT HOẶC DÂY ĐẾN A)
						an   = (bet*1000)-bet;
						text = 'Thắng Lớn';
						code = 8;
					}else if (tuQuy) {
						// x150     TỨ QUÝ (TỨ QUÝ)
						an   = (bet*150)-bet;
						text = 'Tứ Quý';
						code = 7;
					}else if (bo3 && bo2 > 0) {
						// x50      CÙ LŨ (1 BỘ 3 VÀ 1 BỘ 2)
						an   = (bet*50)-bet;
						text = 'Cù Lũ';
						code = 6;
					}else if (dongChat) {
						// x20		THÙNG (ĐỒNG CHẤT)
						an   = (bet*20)-bet;
						text = 'Thùng';
						code = 5;
					}else if (DAK && !dongChat) {
						// x13		SẢNH (DÂY)
						an   = (bet*13)-bet;
						text = 'Sảnh';
						code = 4;
					}else if (bo3 && bo2 == 0) {
						// x8 		SÁM CÔ (1 BỘ 3)
						an   = (bet*8)-bet;
						text = 'Sám Cô';
						code = 3;
					}else if (bo2 > 1) {
						// x5	 	THÚ (2 ĐÔI)
						an   = (bet*5)-bet;
						text = 'Thú';
						code = 2;
					}else if (bo2 == 1 && (bo2_a[0] > 9 || bo2_a[0] == 0)) {
						// x2.5	 	1 ĐÔI > J
						an   = (bet*2.5)-bet;
						text = 'Đôi ' + base_card.name[bo2_a[0]];
						code = 1;
					}

					if (an > 0) {
						if (code > 6) {
							miniPokerTop.create({'name': client.profile.name, 'win': an, 'bet': bet, 'type': code, 'red': red, 'time': new Date()});
						}
						if (red) {
							UserInfo.findOneAndUpdate({id:client.UID}, {$inc:{red:an}}, function(err,cat){});
							if (bet == 100) {
								miniPoker100R.create({'name': client.profile.name, 'win': an+bet, 'type': code, 'kq': ketqua, 'time': new Date()});
							}else if (bet == 1000) {
								miniPoker1kR.create({'name': client.profile.name, 'win': an+bet, 'type': code, 'kq': ketqua, 'time': new Date()});
							}else{
								miniPoker10kR.create({'name': client.profile.name, 'win': an+bet, 'type': code, 'kq': ketqua, 'time': new Date()});
							}
						}else{
							thuong = Math.floor(an*0.08);
							UserInfo.findOneAndUpdate({id:client.UID}, {$inc:{red:thuong, xu:an}}, function(err,cat){});
							if (bet == 100) {
								miniPoker100X.create({'name': client.profile.name, 'win': an+bet, 'red': thuong, 'type': code, 'kq': ketqua, 'time': new Date()});
							}else if (bet == 1000) {
								miniPoker1kX.create({'name': client.profile.name, 'win': an+bet, 'red': thuong, 'type': code, 'kq': ketqua, 'time': new Date()});
							}else{
								miniPoker10kX.create({'name': client.profile.name, 'win': an+bet, 'red': thuong, 'type': code, 'kq': ketqua, 'time': new Date()});
							}
						}
						client.emit('p', {mini:{poker:{status:1, card:ketqua, phien: phien, hu: quyHu, win: an+bet, thuong: thuong, text: text, code: code}}, user:red ? {red:user.red-bet} : {xu:user.xu-bet}});
					}else{
						if (red) {
							UserInfo.findOneAndUpdate({id:client.UID}, {$inc:{red:an}}, function(err,cat){});
							if (bet == 100) {
								miniPoker100R.create({'name': client.profile.name, 'kq': ketqua, 'time': new Date()});
							}else if (bet == 1000) {
								miniPoker1kR.create({'name': client.profile.name, 'kq': ketqua, 'time': new Date()});
							}else{
								miniPoker10kR.create({'name': client.profile.name, 'kq': ketqua, 'time': new Date()});
							}
						}else{
							thuong = Math.floor(an*0.08);
							UserInfo.findOneAndUpdate({id:client.UID}, {$inc:{red:thuong, xu:an}}, function(err,cat){});
							if (bet == 100) {
								miniPoker100X.create({'name': client.profile.name, 'kq': ketqua, 'time': new Date()});
							}else if (bet == 1000) {
								miniPoker1kX.create({'name': client.profile.name, 'kq': ketqua, 'time': new Date()});
							}else{
								miniPoker10kX.create({'name': client.profile.name, 'kq': ketqua, 'time': new Date()});
							}
						}
						UserInfo.findOneAndUpdate({id:client.UID}, red ? {$inc:{red:-bet}} : {$inc:{xu:-bet}}, function(err,cat){});
						client.emit('p', {mini:{poker:{status:1, card:ketqua, phien: phien, hu: quyHu}}, user:red ? {red:user.red-bet} : {xu:user.xu-bet}});
					}
				});
			}
		});
	}
}

function log(client, data){
	var bet  = Math.abs(parseInt(data.bet));  // Mức cược
	var page = Math.abs(parseInt(data.page)); // trang
	var red  = !!data.red;                    // Loại tiền (Red: true, Xu: false)
	if (isNaN(bet) || page < 1 || !(bet == 100 || bet == 1000 || bet == 10000)) {
		client.emit('p', {notice:{text: "DỮ LIỆU KHÔNG ĐÚNG...", title: "MINI POKER"}});
	}else{
		var kmess = 8;
		var regex = new RegExp("^" + client.profile.name + "$", 'i');
		if (red) {
			if (bet == 100) {
				miniPoker100R.countDocuments({name: {$regex: regex}}).exec(function(err, total){
					miniPoker100R.find({name: {$regex: regex}}, 'id win type kq time', {sort:{'_id':-1}, skip: (page-1)*kmess, limit: kmess}, function(err, result) {
						Promise.all(result.map(function(obj){
							obj = obj._doc;
							return new Promise((a, b) => {
								Promise.all(obj.kq.map(function(kq){
									return '<color=#ffffff>' + base_card.name[kq.card] + '</color><color=#' + (kq.type < 2 ? 'ff0000' : 'A0A0A0') + '>' + base_card.type[kq.type] + '</color>';
								}))
								.then(kq => {
									obj.kq = kq.join(' ');
									a(obj)
								})
							})
						}))
						.then(result2 => {
							client.emit('p', {mini:{poker:{log:{data:result2, page:page, kmess:kmess, total:total}}}});
						})
					});
				})
			}else if (bet == 1000) {
				miniPoker1kR.countDocuments({name: {$regex: regex}}).exec(function(err, total){
					miniPoker1kR.find({name: {$regex: regex}}, 'id win type kq time', {sort:{'_id':-1}, skip: (page-1)*kmess, limit: kmess}, function(err, result) {
						Promise.all(result.map(function(obj){
							obj = obj._doc;
							return new Promise((a, b) => {
								Promise.all(obj.kq.map(function(kq){
									return '<color=#ffffff>' + base_card.name[kq.card] + '</color><color=#' + (kq.type < 2 ? 'ff0000' : 'A0A0A0') + '>' + base_card.type[kq.type] + '</color>';
								}))
								.then(kq => {
									obj.kq = kq.join(' ');
									a(obj)
								})
							})
						}))
						.then(result2 => {
							client.emit('p', {mini:{poker:{log:{data:result2, page:page, kmess:kmess, total:total}}}});
						})
					});
				})
			}else{
				miniPoker10kR.countDocuments({name: {$regex: regex}}).exec(function(err, total){
					miniPoker10kR.find({name: {$regex: regex}}, 'id win type kq time', {sort:{'_id':-1}, skip: (page-1)*kmess, limit: kmess}, function(err, result) {
						Promise.all(result.map(function(obj){
							obj = obj._doc;
							return new Promise((a, b) => {
								Promise.all(obj.kq.map(function(kq){
									return '<color=#ffffff>' + base_card.name[kq.card] + '</color><color=#' + (kq.type < 2 ? 'ff0000' : 'A0A0A0') + '>' + base_card.type[kq.type] + '</color>';
								}))
								.then(kq => {
									obj.kq = kq.join(' ');
									a(obj)
								})
							})
						}))
						.then(result2 => {
							client.emit('p', {mini:{poker:{log:{data:result2, page:page, kmess:kmess, total:total}}}});
						})
					});
				})
			}
		}else{
			if (bet == 100) {
				miniPoker100X.countDocuments({name: {$regex: regex}}).exec(function(err, total){
					miniPoker100X.find({name: {$regex: regex}}, 'id win type kq time', {sort:{'_id':-1}, skip: (page-1)*kmess, limit: kmess}, function(err, result) {
						Promise.all(result.map(function(obj){
							obj = obj._doc;
							return new Promise((a, b) => {
								Promise.all(obj.kq.map(function(kq){
									return '<color=#ffffff>' + base_card.name[kq.card] + '</color><color=#' + (kq.type < 2 ? 'ff0000' : 'A0A0A0') + '>' + base_card.type[kq.type] + '</color>';
								}))
								.then(kq => {
									obj.kq = kq.join(' ');
									a(obj)
								})
							})
						}))
						.then(result2 => {
							client.emit('p', {mini:{poker:{log:{data:result2, page:page, kmess:kmess, total:total}}}});
						})
					});
				})
			}else if (bet == 1000) {
				miniPoker1kX.countDocuments({name: {$regex: regex}}).exec(function(err, total){
					miniPoker1kX.find({name: {$regex: regex}}, 'id win type kq time', {sort:{'_id':-1}, skip: (page-1)*kmess, limit: kmess}, function(err, result) {
						Promise.all(result.map(function(obj){
							obj = obj._doc;
							return new Promise((a, b) => {
								Promise.all(obj.kq.map(function(kq){
									return '<color=#ffffff>' + base_card.name[kq.card] + '</color><color=#' + (kq.type < 2 ? 'ff0000' : 'A0A0A0') + '>' + base_card.type[kq.type] + '</color>';
								}))
								.then(kq => {
									obj.kq = kq.join(' ');
									a(obj)
								})
							})
						}))
						.then(result2 => {
							client.emit('p', {mini:{poker:{log:{data:result2, page:page, kmess:kmess, total:total}}}});
						})
					});
				})
			}else{
				miniPoker10kX.countDocuments({name: {$regex: regex}}).exec(function(err, total){
					miniPoker10kX.find({name: {$regex: regex}}, 'id win type kq time', {sort:{'_id':-1}, skip: (page-1)*kmess, limit: kmess}, function(err, result) {
						Promise.all(result.map(function(obj){
							obj = obj._doc;
							return new Promise((a, b) => {
								Promise.all(obj.kq.map(function(kq){
									return '<color=#ffffff>' + base_card.name[kq.card] + '</color><color=#' + (kq.type < 2 ? 'ff0000' : 'A0A0A0') + '>' + base_card.type[kq.type] + '</color>';
								}))
								.then(kq => {
									obj.kq = kq.join(' ');
									a(obj)
								})
							})
						}))
						.then(result2 => {
							client.emit('p', {mini:{poker:{log:{data:result2, page:page, kmess:kmess, total:total}}}});
						})
					});
				})
			}
		}
	}
}

function top(client, data){
	var page = Math.abs(parseInt(data.page)); // trang
	var hu   = !!data.hu;
	var red  = !!data.red;                    // Loại tiền (Red: true, Xu: false)
	if (page < 1) {
		client.emit('p', {notice:{text: "DỮ LIỆU KHÔNG ĐÚNG...", title: "MINI POKER"}});
	}else{
		var kmess = 10;
		var objSearch = (hu ? (red ? {type: 9, red: true} : {type: 9, red: false}) : (red ? {type: {$lt: 9}, red: true} : {type: {$lt: 9}, red: false}));
		miniPokerTop.countDocuments(objSearch).exec(function(err, total){
			miniPokerTop.find(objSearch, 'name win bet time', {sort:{'_id':-1}, skip: (page-1)*kmess, limit: kmess}, function(err, result) {
				client.emit('p', {mini:{poker:{top:{data:result, page:page, kmess:kmess, total:total}}}});
			});
		})
	}
}

function onData(client, data){
	if (void 0 !== data.info) {
		info(client, data.info)
	}
	if (void 0 !== data.spin) {
		spin(client, data.spin)
	}
	if (void 0 !== data.log) {
		log(client, data.log)
	}
	if (void 0 !== data.top) {
		top(client, data.top)
	}
}
module.exports = onData;
