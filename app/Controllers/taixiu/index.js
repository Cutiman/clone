
const TXPhien = require('../../Models/TaiXiu_phien');
const TXCuoc  = require('../../Models/TaiXiu_cuoc');
const TXChat  = require('../../Models/TaiXiu_chat');
const TaiXiu_User = require('../../Models/TaiXiu_user');

const TXCuocOne  = require('../../Models/TaiXiu_one');

const UserInfo = require('../../Models/UserInfo');

function getState(client){
	client.emit('p', {taixiu:{time_remain: client.server.TaiXiu_time}});
}

function getLogs(client){
	var username = '';

	var TaiXiu_red_tong_tai   = 0;
	var TaiXiu_red_tong_xiu   = 0;
	var TaiXiu_red_me_tai     = 0;
	var TaiXiu_red_me_xiu     = 0;
	var taixiu_red_player_tai = 0;
	var taixiu_red_player_xiu = 0;
	var taixiu_red_player_tai_temp = new Array();
	var taixiu_red_player_xiu_temp = new Array();

	var TaiXiu_xu_tong_tai   = 0;
	var TaiXiu_xu_tong_xiu   = 0;
	var TaiXiu_xu_me_tai     = 0;
	var TaiXiu_xu_me_xiu     = 0;
	var taixiu_xu_player_tai = 0;
	var taixiu_xu_player_xiu = 0;
	var taixiu_xu_player_tai_temp = new Array();
	var taixiu_xu_player_xiu_temp = new Array();

	var ChanLe_red_tong_chan   = 0;
	var ChanLe_red_tong_le     = 0;
	var ChanLe_red_me_chan     = 0;
	var ChanLe_red_me_le       = 0;
	var chanle_red_player_chan = 0;
	var chanle_red_player_le   = 0;
	var chanle_red_player_chan_temp = new Array();
	var chanle_red_player_le_temp   = new Array();

	var ChanLe_xu_tong_chan   = 0;
	var ChanLe_xu_tong_le     = 0;
	var ChanLe_xu_me_chan     = 0;
	var ChanLe_xu_me_le       = 0;
	var chanle_xu_player_chan = 0;
	var chanle_xu_player_le   = 0;
	var chanle_xu_player_chan_temp = new Array();
	var chanle_xu_player_le_temp   = new Array();

	var active1 = new Promise((resolve, reject) => {
		TXPhien.find({}, {}, {sort:{'id':-1}, limit: 125}, function(err, post) {
			if (err) return reject(err)
			Promise.all(post.map(function(obj){return {'dice':[obj.dice1,obj.dice2,obj.dice3], 'phien':obj.id}}))
			.then(function(arrayOfResults) {
				resolve(arrayOfResults)
			})
		});
	});
	var active2 = new Promise((resolve, reject) => {
		TXChat.find({},'name value id', {sort:{'id':-1}, limit: 20}, function(err, post) {
			if (err) return reject(err)
			Promise.all(post.map(function(obj){return {'user':obj.name, 'value':obj.value}}))
			.then(function(arrayOfResults) {
				resolve(arrayOfResults)
			})
		});
	});
	var active3 = new Promise((resolve, reject) => {
		UserInfo.findOne({id:client.UID}, 'name', function(err, user){
			username = user.name
		});
		TXPhien.findOne({}, 'id', {sort:{'id':-1}}, function(err, last) {
			if (last !== null){
				var phien = last.id+1;

				TXCuoc.find({phien:phien}, async function(err, list) {
					//console.log(list)
					var cuoc_data = new Promise((resolve, reject) => {
						Promise.all(list.filter(function(obj){
							if (obj.taixiu == true && obj.red == true && obj.select == true){           // Tổng Red Tài
								TaiXiu_red_tong_tai += obj.bet;
								if(taixiu_red_player_tai_temp[obj.name] === void 0) taixiu_red_player_tai_temp[obj.name] = 1;
							} else if (obj.taixiu == true && obj.red == true && obj.select == false) {  // Tổng Red Xỉu
								TaiXiu_red_tong_xiu += obj.bet;
								if(taixiu_red_player_xiu_temp[obj.name] === void 0) taixiu_red_player_xiu_temp[obj.name] = 1;
							} else if (obj.taixiu == true && obj.red == false && obj.select == true) {  // Tổng Xu Tài
								TaiXiu_xu_tong_tai += obj.bet;
								if(taixiu_xu_player_tai_temp[obj.name] === void 0) taixiu_xu_player_tai_temp[obj.name] = 1;
							} else if (obj.taixiu == true && obj.red == false && obj.select == false) { // Tổng Xu Xỉu
								TaiXiu_xu_tong_xiu += obj.bet;
								if(taixiu_xu_player_xiu_temp[obj.name] === void 0) taixiu_xu_player_xiu_temp[obj.name] = 1;
							} else if (obj.taixiu == false && obj.red == true && obj.select == true) {  // Tổng Red Chẵn
								ChanLe_red_tong_chan += obj.bet;
								if(chanle_red_player_chan_temp[obj.name] === void 0) chanle_red_player_chan_temp[obj.name] = 1;
							} else if (obj.taixiu == false && obj.red == true && obj.select == false) {  // Tổng Red Lẻ
								ChanLe_red_tong_le += obj.bet;
								if(chanle_red_player_le_temp[obj.name] === void 0) chanle_red_player_le_temp[obj.name] = 1;
							} else if (obj.taixiu == false && obj.red == false && obj.select == true) {  // Tổng xu Chẵn
								ChanLe_xu_tong_chan += obj.bet;
								if(chanle_xu_player_chan_temp[obj.name] === void 0) chanle_xu_player_chan_temp[obj.name] = 1;
							} else if (obj.taixiu == false && obj.red == false && obj.select == false) { // Tổng xu Lẻ
								ChanLe_xu_tong_le += obj.bet;
								if(chanle_xu_player_le_temp[obj.name] === void 0) chanle_xu_player_le_temp[obj.name] = 1;
							}

							return obj.name == username
						}))
						.then(function(arrayOfResults) {
							resolve(arrayOfResults)
						})
					});
					Promise.all([cuoc_data]).then(values => {
						taixiu_red_player_tai  = Object.keys(taixiu_red_player_tai_temp).length
						taixiu_red_player_xiu  = Object.keys(taixiu_red_player_xiu_temp).length
						taixiu_xu_player_tai   = Object.keys(taixiu_xu_player_tai_temp).length
						taixiu_xu_player_xiu   = Object.keys(taixiu_xu_player_xiu_temp).length
						chanle_red_player_chan = Object.keys(chanle_red_player_chan_temp).length
						chanle_red_player_le   = Object.keys(chanle_red_player_le_temp).length
						chanle_xu_player_chan  = Object.keys(chanle_xu_player_chan_temp).length
						chanle_xu_player_le    = Object.keys(chanle_xu_player_le_temp).length
						Promise.all(values[0].map(function(obj){
							if (obj.taixiu == true && obj.red == true && obj.select == true){           // Me Red Tài
								TaiXiu_red_me_tai += obj.bet
							} else if (obj.taixiu == true && obj.red == true && obj.select == false) {  // Me Red Xỉu
								TaiXiu_red_me_xiu += obj.bet
							} else if (obj.taixiu == true && obj.red == false && obj.select == true) {  // Me Xu Tài
								TaiXiu_xu_me_tai += obj.bet
							} else if (obj.taixiu == true && obj.red == false && obj.select == false) { // Me Xu Xỉu
								TaiXiu_xu_me_xiu += obj.bet
							} else if (obj.taixiu == false && obj.red == true && obj.select == true) {  // Me Red Chẵn
								ChanLe_red_me_chan += obj.bet
							} else if (obj.taixiu == false && obj.red == true && obj.select == false) {  // Me Red Lẻ
								ChanLe_red_me_le += obj.bet
							} else if (obj.taixiu == false && obj.red == false && obj.select == true) {  // Me xu Chẵn
								ChanLe_xu_me_chan += obj.bet
							} else if (obj.taixiu == false && obj.red == false && obj.select == false) { // Me xu Lẻ
								ChanLe_xu_me_le += obj.bet
							}
							return true
						}))
						.then(function(arrayOfResults) {
							resolve(true)
						})
					}, reason => {
						console.log(reason)
					});
				});
			}
		});
	});

	var active4 = new Promise((resolve, reject) => {
		TaiXiu_User.findOne({uid: client.UID}, 't_day_thang_red t_day_thua_red t_day_thang_xu t_day_thua_xu c_day_thang_red c_day_thua_red c_day_thang_xu c_day_thua_xu t_day_thang_red_ht t_day_thua_red_ht t_day_thang_xu_ht t_day_thua_xu_ht c_day_thang_red_ht c_day_thua_red_ht c_day_thang_xu_ht c_day_thua_xu_ht', function(err, data) {
			if (err) return reject(err)
			resolve(data)
		});
	});

	Promise.all([active1, active2, active3, active4]).then(values => {
		client.emit('p', {taixiu:{du_day: values[3], logs: values[0], chats: values[1].reverse(), taixiu:{ red_tai: TaiXiu_red_tong_tai, red_xiu: TaiXiu_red_tong_xiu, xu_tai: TaiXiu_xu_tong_tai, xu_xiu: TaiXiu_xu_tong_xiu, red_me_tai: TaiXiu_red_me_tai, red_me_xiu: TaiXiu_red_me_xiu, xu_me_tai: TaiXiu_xu_me_tai, xu_me_xiu: TaiXiu_xu_me_xiu, red_player_tai: taixiu_red_player_tai, red_player_xiu: taixiu_red_player_xiu, xu_player_tai: taixiu_xu_player_tai, xu_player_xiu: taixiu_xu_player_xiu, }, chanle:{ red_chan: ChanLe_red_tong_chan, red_le: ChanLe_red_tong_le, xu_chan: ChanLe_xu_tong_chan, xu_le: ChanLe_xu_tong_le, red_me_chan: ChanLe_red_me_chan, red_me_le: ChanLe_red_me_le, xu_me_chan: ChanLe_xu_me_chan, xu_me_le: ChanLe_xu_me_le, red_player_chan: chanle_red_player_chan, red_player_le: chanle_red_player_le, xu_player_chan: chanle_xu_player_chan, xu_player_le: chanle_xu_player_le,}}});
	}, reason => {
		console.log(reason)
	});
}

function getNew(client){
	var active1 = new Promise((resolve, reject) => {
		UserInfo.findOne({id:client.UID}, 'red xu', function(err, user){
			if (err) return reject(err)
			resolve(user)
		});
	});
	var active2 = new Promise((resolve, reject) => {
		TaiXiu_User.findOne({uid: client.UID}, 't_day_thang_red t_day_thua_red t_day_thang_xu t_day_thua_xu c_day_thang_red c_day_thua_red c_day_thang_xu c_day_thua_xu t_day_thang_red_ht t_day_thua_red_ht t_day_thang_xu_ht t_day_thua_xu_ht c_day_thang_red_ht c_day_thua_red_ht c_day_thang_xu_ht c_day_thua_xu_ht', function(err, data) {
			if (err) return reject(err)
			resolve(data)
		});
	});

	Promise.all([active1, active2]).then(values => {
		//console.log(values)
		client.emit('p', {user: values[0],taixiu:{du_day: values[1]}});
	}, reason => {
		console.log(reason)
	});
}


const chat = async function(client, str){
	str = str.trim();
	if (client.auth && client.UID && str.length>0 && str.length<101) {
		TXChat.findOne({}, 'uid value', {sort:{'id':-1}}, async function(err, post) {
			if (post === null || (post.uid !== client.UID && post.value !== str)) {
				var query = UserInfo.findOne({id:client.UID});
				query.select('name');
				query.exec(async function (err, d) {
				  if (err) return;

					try {
						const create = await TXChat.create({'uid':client.UID, 'name':d.name, 'value':str});
						if (!!create) {
							client.broadcast.emit('p', {taixiu:{chat:{user:create.name,value:create.value}}});
						}
					} catch (err) {
						//console.log(err);
					}
				});
			}
		});
	}
}

const cuoc = async function(client, data){
	if (client.auth && client.UID) {
		if (client.server.TaiXiu_time < 4 || client.server.TaiXiu_time > 60) {
			client.emit('p', {taixiu:{err:'Vui lòng cược ở phiên sau.!!'}});
			return;
		}
		var bet    = Math.abs(isNaN(parseInt(data.bet))?0:parseInt(data.bet)); // Số tiền
		var taixiu = !!data.taixiu; // Tài xỉu:true    Chẵn lẻ:false
		var red    = !!data.red; // Loại tiền (Red: true, Xu: false)
		var select = !!data.select;      // Cửa đặt (Tài: 1, Xỉu: 0)

		if (bet < 1000) {
			client.emit('p', {taixiu:{err:'Số tiền phải lớn hơn 1000.!!'}});
			return;
		}

		var active_findUser = new Promise((resolve, reject) => {
			UserInfo.findOne({id:client.UID}, red ? 'red name':'xu name', function(err, user){
				if (user === null || (red && user.red < bet) || (!red && user.xu < bet)) {
					reject('Bạn không đủ ' + (red ? 'Red':'Xu') + ' để cược.!!')
					return;
				}
				resolve(user)
			});
		});

		var active_findPhienGame = new Promise((resolve, reject) => {
			TXPhien.findOne({}, 'id', {sort:{'id':-1}}, function(err, last) {
				if (last === null){
					reject('Vui lòng cược ở phiên sau.!!')
					return;
				}
				resolve(last)
			});
		});

		Promise.all([active_findUser, active_findPhienGame]).then(values => {
			var user  = values[0]
			var phien = values[1].id+1;
			var active_check = new Promise((resolve, reject) => {
				TXCuoc.find({uid:client.UID, phien:phien, taixiu:taixiu, red:red}, async function(err, list) {
					var me_red = 0
					var me_xu  = 0
					var check = new Promise((resolve, reject) => {
						Promise.all(list.filter(function(obj){
							if(obj.red) me_red += obj.bet
							else        me_xu  += obj.bet
							return obj.select == !select
						}))
						.then(function(arrayOfResults) {
							resolve(arrayOfResults)
						})
					});
					Promise.all([check]).then(async value => {
						if (value[0].length) {
							client.emit('p', {taixiu:{err:'Chỉ được cược 1 bên.!!'}});
						}else{
							try {
								const create = await TXCuoc.create({uid:client.UID, name:user.name, phien:phien, bet:bet, taixiu:taixiu, select:select, red:red, time:new Date()});
								if (!!create) {
									//var userVery = red ? {$inc:{red:-bet}} : {$inc:{xu:-bet}};
									UserInfo.findOneAndUpdate({id:client.UID}, red ? {$inc:{red:-bet}} : {$inc:{xu:-bet}}, function(err,cat){});

									TXCuocOne.findOne({uid: client.UID, phien: phien, taixiu:taixiu, select:select, red:red}, function(err, checkOne) {
										if (checkOne){
											TXCuocOne.findOneAndUpdate({uid: client.UID, phien: phien, taixiu:taixiu, select:select, red:red}, {$inc:{bet:bet}}, async function (err, cat){});
										}else{
											TXCuocOne.create({uid: client.UID, phien: phien, taixiu:taixiu, select:select, red:red, bet:bet});
										}
									})

									var taixiuVery = (red ? (select ? (taixiu ? {red_me_tai:me_red+bet} : {red_me_chan:me_red+bet}) : (taixiu ? {red_me_xiu:me_red+bet} : {red_me_le:me_red+bet})) : (select ? (taixiu ? {xu_me_tai:me_xu+bet} : {xu_me_chan:me_xu+bet}) : (taixiu ? {xu_me_xiu:me_xu+bet} : {xu_me_le:me_xu+bet})));
									taixiuVery = (taixiu ? {taixiu: taixiuVery} : {chanle: taixiuVery})
									client.emit('p', {taixiu:taixiuVery,user:red ? {red:user.red-bet} : {xu:user.xu-bet}});
								}
							} catch (err) {
								client.emit('p', {taixiu:{err:err}});
							}
						}
					}, reason => {
						console.log(reason)
					});
				})
			});
		}, reason => {
			client.emit('p', {taixiu:{err:reason}});
		});
	}
}

const get_phien = async function(client, data){
	var getPhien = TXPhien.findOne({id: data.phien});
	var getCuoc  = TXCuoc.find({phien: data.phien, taixiu:data.taixiu, red:data.red});

	var tong_L        = 0;
	var tong_R        = 0;
	var tong_tralai_L = 0;
	var tong_tralai_R = 0;

	Promise.all([getPhien, getCuoc]).then(values => {
		var dataT = {};
		dataT['phien'] = data.phien;
		dataT['time']  = values[0].time;
		dataT['dice']  = [values[0].dice1, values[0].dice2, values[0].dice3];
		var dataL = new Promise((resolve, reject) => {
			Promise.all(values[1].filter(function(obj){
				if(obj.select){
					tong_L += obj.bet
					tong_tralai_L += obj.tralai
				} else {
					tong_R += obj.bet
					tong_tralai_R += obj.tralai
				}
				return obj.select == 1
			}))
			.then(function(arrayOfResults) {
				resolve(arrayOfResults)
			})
		});
		var dataR = new Promise((resolve, reject) => {
			Promise.all(values[1].filter(function(obj){
				return obj.select == 0
			}))
			.then(function(arrayOfResults) {
				resolve(arrayOfResults)
			})
		});
		Promise.all([dataL, dataR]).then(values => {
			dataT['tong_L']        = tong_L
			dataT['tong_R']        = tong_R
			dataT['tong_tralai_L'] = tong_tralai_L
			dataT['tong_tralai_R'] = tong_tralai_R
			dataT['dataL'] = values[0]
			dataT['dataR'] = values[1]
			client.emit('p', {taixiu:{get_phien:dataT}});
		});
	});
}

const get_log = async function(client, data){
	var getCuoc = TXCuoc.find({uid:client.UID, thanhtoan:true, taixiu:data.taixiu, red:data.red}, {}, {sort:{'id':-1}, limit: 50}, );
	Promise.all([getCuoc]).then(value => {
		if (value[0] && value[0].length) {
			var dataT = new Promise((resolve, reject) => {
				Promise.all(value[0].map(function(obj){
					var getPhien = TXPhien.findOne({id: obj.phien});
					return Promise.all([getPhien]).then(values => {
						return values[0] ? {phien: obj.phien, select: obj.select, bet: obj.bet, tralai: obj.tralai, thang: obj.betwin, time: obj.time, dice1: values[0].dice1, dice2: values[0].dice2, dice3: values[0].dice3} : [];
					});
				}))
				.then(function(arrayOfResults) {
					resolve(arrayOfResults)
				})
			});
			Promise.all([dataT]).then(values => {
				client.emit('p', {taixiu:{get_log:values[0]}});
			});
		}
	});
}

const get_top = async function(client, data){
	var taixiu = !!data.taixiu
	var red    = !!data.red
	var getTop = TaiXiu_User.find({}, 'uid ' + (taixiu ? (red ? 't_tong_thang_red' : 't_tong_thang_xu') : (red ? 'c_tong_thang_red' : 'c_tong_thang_xu')), {sort:taixiu ? (red ? {'t_tong_thang_red':-1} : {'t_tong_thang_xu':-1}) : (red ? {'c_tong_thang_red':-1} : {'c_tong_thang_xu':-1}), limit: 20}, );
	Promise.all([getTop]).then(value => {
		if (value[0] && value[0].length) {
			var dataT = new Promise((resolve, reject) => {
				Promise.all(value[0].map(function(obj){
					var getUser = UserInfo.findOne({id: obj.uid});
					return Promise.all([getUser]).then(values => {
						return values[0] ? {name: values[0].name, bet: (taixiu ? (red ? obj.t_tong_thang_red : obj.t_tong_thang_xu) : (red ? obj.c_tong_thang_red : obj.c_tong_thang_xu))} : [];
					});
				}))
				.then(function(arrayOfResults) {
					resolve(arrayOfResults)
				})
			});
			Promise.all([dataT]).then(values => {
				client.emit('p', {taixiu:{get_top:values[0]}});
			});
		}
	});
}

module.exports = {
	getState:  getState,
	getLogs:   getLogs,
	chat:      chat,
	cuoc:      cuoc,
	get_phien: get_phien,
	get_log:   get_log,
	get_top:   get_top,
	getNew:    getNew,
}
