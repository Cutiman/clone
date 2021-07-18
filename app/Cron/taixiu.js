
//const Helpers  = require('../Helpers/Helpers');

const fs          = require('fs');

const UserInfo    = require('../Models/UserInfo')
const TXPhien     = require('../Models/TaiXiu_phien')
const TXCuoc      = require('../Models/TaiXiu_cuoc')
const TaiXiu_User = require('../Models/TaiXiu_user');
const TXCuocOne   = require('../Models/TaiXiu_one');

const dataTaiXiu = '../../data/taixiu.json';
var io       = null
var phien    = 1
var gameLoop = null

function init(obj){
	io = obj
	playGame()
}

TXPhien.findOne({}, 'id', {sort:{'id':-1}}, function(err, last) {
	if (last !== null){
		phien = last.id+1;
	}
})

function anPhanTram(bet){
	return bet*2-Math.ceil(bet*2/100);
}
function truChietKhau(bet){
	return bet-Math.ceil(bet*2/100);
}

function setTaiXiu_user(phien, dice){
	TXCuocOne.find({phien: phien}, {}, function(err, list) {
		if (list.length){
			Promise.all(list.map(function(obj){
				TaiXiu_User.findOne({uid: obj.uid}, function(error, data){
					var bet_thua = obj.bet-obj.tralai
					if (obj.taixiu == true && obj.red == true){          // Red Tài Xỉu
						var update = {
							t_day_thang_red:    obj.win && data.t_day_thang_red < data.t_day_thang_red_ht+1 ? data.t_day_thang_red_ht+1 : data.t_day_thang_red,
							t_day_thua_red:    !obj.win && data.t_day_thua_red < data.t_day_thua_red_ht+1 ? data.t_day_thua_red_ht+1 : data.t_day_thua_red,
							t_day_thang_red_ht: obj.win ? data.t_day_thang_red_ht+1 : 0,
							t_day_thua_red_ht:  obj.win ? 0 : data.t_day_thua_red_ht+1,
							t_thang_lon_red:    obj.win && data.t_thang_lon_red < obj.betwin ? obj.betwin : data.t_thang_lon_red,
							t_thua_lon_red:    !obj.win && data.t_thua_lon_red < bet_thua ? bet_thua : data.t_thua_lon_red
						};
					} else if (obj.taixiu == true && obj.red == false) { // Xu Tài Xỉu
						var update = {
							t_day_thang_xu:    obj.win && data.t_day_thang_xu < data.t_day_thang_xu_ht+1 ? data.t_day_thang_xu_ht+1 : data.t_day_thang_xu,
							t_day_thua_xu:    !obj.win && data.t_day_thua_xu < data.t_day_thua_xu_ht+1 ? data.t_day_thua_xu_ht+1 : data.t_day_thua_xu,
							t_day_thang_xu_ht: obj.win ? data.t_day_thang_xu_ht+1 : 0,
							t_day_thua_xu_ht:  obj.win ? 0 : data.t_day_thua_xu_ht+1,
							t_thang_lon_xu:    obj.win && data.t_thang_lon_xu < obj.betwin ? obj.betwin : data.t_thang_lon_xu,
							t_thua_lon_xu:    !obj.win && data.t_thua_lon_xu < bet_thua ? bet_thua : data.t_thua_lon_xu
						}
					} else if (obj.taixiu == false && obj.red == true) { // Red Chẵn Lẻ
						var update = {
							c_day_thang_red:    obj.win && data.c_day_thang_red < data.c_day_thang_red_ht+1 ? data.c_day_thang_red_ht+1 : data.c_day_thang_red,
							c_day_thua_red:     !obj.win && data.c_day_thua_red < data.c_day_thua_red_ht+1 ? data.c_day_thua_red_ht+1 : data.c_day_thua_red,
							c_day_thang_red_ht: obj.win ? data.c_day_thang_red_ht+1 : 0,
							c_day_thua_red_ht:  obj.win ? 0 : data.c_day_thua_red_ht+1,
							c_thang_lon_red:    obj.win && data.c_thang_lon_red < obj.betwin ? obj.betwin : data.c_thang_lon_red,
							c_thua_lon_red:     !obj.win && data.c_thua_lon_red < bet_thua ? bet_thua : data.c_thua_lon_red,
						}
					} else if (obj.taixiu == false && obj.red == false) { // Xu Chẵn Lẻ
						var update = {
							c_day_thang_xu:    obj.win && data.c_day_thang_xu < data.c_day_thang_xu_ht+1 ? data.c_day_thang_xu_ht+1 : data.c_day_thang_xu,
							c_day_thua_xu:     !obj.win && data.c_day_thua_xu < data.c_day_thua_xu_ht+1 ? data.c_day_thua_xu_ht+1 : data.c_day_thua_xu,
							c_day_thang_xu_ht: obj.win ? data.c_day_thang_xu_ht+1 : 0,
							c_day_thua_xu_ht:  obj.win ? 0 : data.c_day_thua_xu_ht+1,
							c_thang_lon_xu:    obj.win && data.c_thang_lon_xu < obj.betwin ? obj.betwin : data.c_thang_lon_xu,
							c_thua_lon_xu:     !obj.win && data.c_thua_lon_xu < bet_thua ? bet_thua : data.c_thua_lon_xu
						}
					}

					TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$set:update}).exec();

					Promise.all(Object.values(io.nsps['/users'].sockets).filter(function(client){
						if (client.UID !== void 0 && client.UID == obj.uid) {
							io.nsps['/users'].to(client.id).emit('p', {taixiu:{status:{win:obj.win, select:obj.select, bet: obj.win ? obj.betwin+obj.bet : bet_thua}}});
						}
					}));
				});
			}))
		}
	});
}

var TaiXiu_red_tong_tai   = 0;
var TaiXiu_red_tong_xiu   = 0;
var taixiu_red_player_tai = 0;
var taixiu_red_player_xiu = 0;
var taixiu_red_player_tai_temp = new Array();
var taixiu_red_player_xiu_temp = new Array();

var TaiXiu_xu_tong_tai   = 0;
var TaiXiu_xu_tong_xiu   = 0;
var taixiu_xu_player_tai = 0;
var taixiu_xu_player_xiu = 0;
var taixiu_xu_player_tai_temp = new Array();
var taixiu_xu_player_xiu_temp = new Array();

var ChanLe_red_tong_chan   = 0;
var ChanLe_red_tong_le     = 0;
var chanle_red_player_chan = 0;
var chanle_red_player_le   = 0;
var chanle_red_player_chan_temp = new Array();
var chanle_red_player_le_temp   = new Array();

var ChanLe_xu_tong_chan   = 0;
var ChanLe_xu_tong_le     = 0;
var chanle_xu_player_chan = 0;
var chanle_xu_player_le   = 0;
var chanle_xu_player_chan_temp = new Array();
var chanle_xu_player_le_temp   = new Array();

function thongtin_thanhtoan(game_id, dice = false){

	TaiXiu_red_tong_tai   = 0;
	TaiXiu_red_tong_xiu   = 0;
	taixiu_red_player_tai = 0;
	taixiu_red_player_xiu = 0;
	taixiu_red_player_tai_temp = [];
	taixiu_red_player_xiu_temp = [];

	TaiXiu_xu_tong_tai   = 0;
	TaiXiu_xu_tong_xiu   = 0;
	taixiu_xu_player_tai = 0;
	taixiu_xu_player_xiu = 0;
	taixiu_xu_player_tai_temp = [];
	taixiu_xu_player_xiu_temp = [];

	ChanLe_red_tong_chan   = 0;
	ChanLe_red_tong_le     = 0;
	chanle_red_player_chan = 0;
	chanle_red_player_le   = 0;
	chanle_red_player_chan_temp = [];
	chanle_red_player_le_temp   = [];

	ChanLe_xu_tong_chan   = 0;
	ChanLe_xu_tong_le     = 0;
	chanle_xu_player_chan = 0;
	chanle_xu_player_le   = 0;
	chanle_xu_player_chan_temp = [];
	chanle_xu_player_le_temp   = [];

	TXCuoc.find({phien:game_id}, null, {sort:{'id':-1}}, function(err, list) {
		var info_cuoc = new Promise((resolve, reject) => {
			Promise.all(list.map(function(obj){
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

			}))
			.then(function(arrayOfResults) {
				resolve(arrayOfResults)
			})
		});
		Promise.all([info_cuoc]).then(values => {
			if (dice) {

				var TaiXiu_tong_red_lech = Math.abs(TaiXiu_red_tong_tai  -TaiXiu_red_tong_xiu);
				var TaiXiu_tong_xu_lech  = Math.abs(TaiXiu_xu_tong_tai   -TaiXiu_xu_tong_xiu);
				var ChanLe_tong_red_lech = Math.abs(ChanLe_red_tong_chan -ChanLe_red_tong_le);
				var ChanLe_tong_xu_lech  = Math.abs(ChanLe_xu_tong_chan  -ChanLe_xu_tong_le);

				var TaiXiu_red_lech_tai  = TaiXiu_red_tong_tai  > TaiXiu_red_tong_xiu ? true : false;
				var TaiXiu_xu_lech_tai   = TaiXiu_xu_tong_tai   > TaiXiu_xu_tong_xiu  ? true : false;
				var ChanLe_red_lech_chan = ChanLe_red_tong_chan > ChanLe_red_tong_le  ? true : false;
				var ChanLe_xu_lech_chan  = ChanLe_xu_tong_chan  > ChanLe_xu_tong_le   ? true : false;

				Promise.all(list.map(function(obj){
					if (obj.taixiu == true && obj.red == true && obj.select == true){           // Tổng Red Tài
						var win = dice > 10 ? true : false;
						if (TaiXiu_red_lech_tai && TaiXiu_tong_red_lech > 0) {
							if (TaiXiu_tong_red_lech >= obj.bet) {
								// Trả lại hoàn toàn
								TaiXiu_tong_red_lech -= obj.bet
								// code trả lại hoàn toàn
								var active1 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:{red:obj.bet}}).exec();
								var active2 = TXCuoc.findOneAndUpdate({_id:obj._id}, {$set:{thanhtoan: true, win:win, tralai:obj.bet}}).exec();
								var active3 = TXCuocOne.findOneAndUpdate({uid: obj.uid, phien: game_id, taixiu:true, select:true, red:true}, {$set:{win:win}, $inc:{tralai:obj.bet}}).exec();
								return Promise.all([active1, active2, active3])
							}else{
								// Trả lại 1 phần
								// code trả lại 1 phần
								var betwin  = obj.bet-TaiXiu_tong_red_lech;
								var betwinT = truChietKhau(betwin);
								var betwinP = win ? betwinT : 0;
								var active1 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:{red:TaiXiu_tong_red_lech}}).exec();
								if (win) {
									// Thắng nhưng bị trừ tiền trả lại
									// code cộng tiền thắng
									var active_s1 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:{red:anPhanTram(betwin)}}).exec();
									var active_s2 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{t_tong_thang_red:betwinT}}).exec();
									var active2   = Promise.all([active_s1, active_s2])
								}else{
									var active2 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{t_tong_thua_red:betwin}}).exec();
								}
								var active3 = TXCuoc.findOneAndUpdate({_id:obj._id}, {$set:{thanhtoan: true, win:win, betwin:betwinP, tralai:TaiXiu_tong_red_lech}}).exec();
								var active4 = TXCuocOne.findOneAndUpdate({uid: obj.uid, phien: game_id, taixiu:true, select:true, red:true}, {$set:{win:win}, $inc:{tralai:TaiXiu_tong_red_lech, betwin:betwinP}}).exec();
								// code cập nhật tiền trả lại
								TaiXiu_tong_red_lech = 0;
								return Promise.all([active1, active2, active3, active4])
							}
						}else{
							if (win) {
								// code cộng tiền thắng hoàn toàn
								var betwin  = truChietKhau(obj.bet)
								var active1 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:{red:anPhanTram(obj.bet)}}).exec();
								var active2 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{t_tong_thang_red:betwin}}).exec();
								var active3 = TXCuoc.findOneAndUpdate({_id:obj._id}, {$set:{thanhtoan: true, win:true, betwin:betwin}}).exec();
								var active4 = TXCuocOne.findOneAndUpdate({uid: obj.uid, phien: game_id, taixiu:true, select:true, red:true}, {$set:{win:true}, $inc:{betwin:betwin}}).exec();
								return Promise.all([active1, active2, active3, active4])
							}else{
								var active1 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{t_tong_thua_red:obj.bet}}).exec();
								var active2 = TXCuoc.findOneAndUpdate({_id:obj._id}, {$set:{thanhtoan: true}}).exec();
								return Promise.all([active1, active2])
							}
						}
					} else if (obj.taixiu == true && obj.red == true && obj.select == false) {  // Tổng Red Xỉu
						var win = dice > 10 ? false : true;
						if (!TaiXiu_red_lech_tai && TaiXiu_tong_red_lech > 0) {
							if (TaiXiu_tong_red_lech >= obj.bet) {
								// Trả lại hoàn toàn
								TaiXiu_tong_red_lech -= obj.bet
								// code trả lại hoàn toàn
								var active1 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:{red:obj.bet}}).exec();
								var active2 = TXCuoc.findOneAndUpdate({_id:obj._id}, {$set:{thanhtoan: true, win:win, tralai:obj.bet}}).exec();
								var active3 = TXCuocOne.findOneAndUpdate({uid: obj.uid, phien: game_id, taixiu:true, select:false, red:true}, {$set:{win:win}, $inc:{tralai:obj.bet}}).exec();
								return Promise.all([active1, active2, active3])
							}else{
								// Trả lại 1 phần
								// code trả lại 1 phần
								var betwin  = obj.bet-TaiXiu_tong_red_lech;
								var betwinT = truChietKhau(betwin);
								var betwinP = win ? betwinT : 0;
								var active1 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:{red:TaiXiu_tong_red_lech}}).exec();
								if (win) {
									// Thắng nhưng bị trừ tiền trả lại
									// code cộng tiền thắng
									var active_s1 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:{red:anPhanTram(betwin)}}).exec();
									var active_s2 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{t_tong_thang_red:betwinT}}).exec();
									var active2   = Promise.all([active_s1, active_s2])
								}else{
									var active2 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{t_tong_thua_red:betwin}}).exec();
								}
								var active3 = TXCuoc.findOneAndUpdate({_id:obj._id}, {$set:{thanhtoan: true, win:win, betwin:betwinP, tralai:TaiXiu_tong_red_lech}}).exec();
								var active4 = TXCuocOne.findOneAndUpdate({uid: obj.uid, phien: game_id, taixiu:true, select:false, red:true}, {$set:{win:win}, $inc:{tralai:TaiXiu_tong_red_lech, betwin:betwinP}}).exec();
								// code cập nhật tiền trả lại
								TaiXiu_tong_red_lech = 0;
								return Promise.all([active1, active2, active3, active4])
							}
						}else{
							if (win) {
								// code cộng tiền thắng hoàn toàn
								var betwin  = truChietKhau(obj.bet)
								var active1 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:{red:anPhanTram(obj.bet)}}).exec();
								var active2 = TXCuoc.findOneAndUpdate({_id:obj._id}, {$set:{thanhtoan: true, win:true, betwin:betwin}}).exec();
								var active3 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{t_tong_thang_red:betwin}}).exec();
								var active4 = TXCuocOne.findOneAndUpdate({uid: obj.uid, phien: game_id, taixiu:true, select:false, red:true}, {$set:{win:true}, $inc:{betwin:betwin}}).exec();
								return Promise.all([active1, active2, active3, active4])
							}else{
								var active1 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{t_tong_thua_red:obj.bet}}).exec();
								var active2 = TXCuoc.findOneAndUpdate({_id:obj._id}, {$set:{thanhtoan: true}}).exec();
								return Promise.all([active1, active2])
							}
						}
					} else if (obj.taixiu == true && obj.red == false && obj.select == true) {  // Tổng Xu Tài
						var win = dice > 10 ? true : false;
						if (TaiXiu_xu_lech_tai && TaiXiu_tong_xu_lech > 0) {
							if (TaiXiu_tong_xu_lech >= obj.bet) {
								// Trả lại hoàn toàn
								TaiXiu_tong_xu_lech -= obj.bet
								// code trả lại hoàn toàn
								var active1 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:{xu:obj.bet}}).exec();
								var active2 = TXCuoc.findOneAndUpdate({_id:obj._id}, {$set:{thanhtoan: true, win:win, tralai:obj.bet}}).exec();
								var active3 = TXCuocOne.findOneAndUpdate({uid: obj.uid, phien: game_id, taixiu:true, select:true, red:false}, {$set:{win:win}, $inc:{tralai:obj.bet}}).exec();
								return Promise.all([active1, active2, active3])
							}else{
								// Trả lại 1 phần
								// code trả lại 1 phần
								var betwin  = obj.bet-TaiXiu_tong_xu_lech;
								var betwinT = win ? betwin : 0;
								var active1 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:{xu:TaiXiu_tong_xu_lech}}).exec();
								if (win) {
									// Thắng nhưng bị trừ tiền trả lại
									// code cộng tiền thắng
									var x2 = betwin*2;
									var active_s1 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:{xu:x2}}).exec();
									var active_s2 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{t_tong_thang_xu:betwin}}).exec();
									var active2   = Promise.all([active_s1, active_s2])
								}else{
									var active2 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{t_tong_thua_xu:betwin}}).exec();
								}
								var active3 = TXCuoc.findOneAndUpdate({_id:obj._id}, {$set:{thanhtoan: true, win:win, betwin:betwinT, tralai:TaiXiu_tong_xu_lech}}).exec();
								var active4 = TXCuocOne.findOneAndUpdate({uid: obj.uid, phien: game_id, taixiu:true, select:true, red:false}, {$set:{win:win}, $inc:{tralai:TaiXiu_tong_xu_lech, betwin:betwinT}}).exec();
								// code cập nhật tiền trả lại
								TaiXiu_tong_xu_lech = 0;
								return Promise.all([active1, active2, active3, active4])
							}
						}else{
							if (win) {
								// code cộng tiền thắng hoàn toàn
								var x2 = obj.bet*2;
								var active1 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:{xu:x2}}).exec();
								var active2 = TXCuoc.findOneAndUpdate({_id:obj._id}, {$set:{thanhtoan: true, win:true, betwin:obj.bet}}).exec();
								var active3 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{t_tong_thang_xu:obj.bet}}).exec();
								var active4 = TXCuocOne.findOneAndUpdate({uid: obj.uid, phien: game_id, taixiu:true, select:true, red:false}, {$set:{win:true}, $inc:{betwin:obj.bet}}).exec();
								return Promise.all([active1, active2, active3, active4])
							}else{
								var active1 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{t_tong_thua_xu:obj.bet}}).exec();
								var active2 = TXCuoc.findOneAndUpdate({_id:obj._id}, {$set:{thanhtoan: true}}).exec();
								return Promise.all([active1, active2])
							}
						}
					} else if (obj.taixiu == true && obj.red == false && obj.select == false) { // Tổng Xu Xỉu
						var win = dice > 10 ? false : true;
						if (!TaiXiu_xu_lech_tai && TaiXiu_tong_xu_lech > 0) {
							if (TaiXiu_tong_xu_lech >= obj.bet) {
								// Trả lại hoàn toàn
								TaiXiu_tong_xu_lech -= obj.bet
								// code trả lại hoàn toàn
								var active1 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:{xu:obj.bet}}).exec();
								var active2 = TXCuoc.findOneAndUpdate({_id:obj._id}, {$set:{thanhtoan: true, win:win, tralai:obj.bet}}).exec();
								var active3 = TXCuocOne.findOneAndUpdate({uid: obj.uid, phien: game_id, taixiu:true, select:false, red:false}, {$set:{win:win}, $inc:{tralai:obj.bet}}).exec();
								return Promise.all([active1, active2, active3])
							}else{
								// Trả lại 1 phần
								// code trả lại 1 phần
								var betwin  = obj.bet-TaiXiu_tong_xu_lech;
								var betwinT = win ? betwin : 0;
								var active1 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:{xu:TaiXiu_tong_xu_lech}}).exec();
								if (win) {
									// Thắng nhưng bị trừ tiền trả lại
									// code cộng tiền thắng
									var x2 = betwin*2;
									var active_s1 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:{xu:x2}}).exec();
									var active_s2 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{t_tong_thang_xu:betwin}}).exec();
									var active2 =  Promise.all([active_s1, active_s2])
								}else{
									var active2 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{t_tong_thua_xu:betwin}}).exec();
								}
								var active3 = TXCuoc.findOneAndUpdate({_id:obj._id}, {$set:{thanhtoan: true, win:win, betwin:betwinT, tralai:TaiXiu_tong_xu_lech}}).exec();
								var active4 = TXCuocOne.findOneAndUpdate({uid: obj.uid, phien: game_id, taixiu:true, select:false, red:false}, {$set:{win:win}, $inc:{tralai:TaiXiu_tong_xu_lech, betwin:betwinT}}).exec();
								// code cập nhật tiền trả lại
								TaiXiu_tong_xu_lech = 0;
								return Promise.all([active1, active2, active3, active4])
							}
						}else{
							if (win) {
								// code cộng tiền thắng hoàn toàn
								var x2 = obj.bet*2;
								var active1 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:{xu:x2}}).exec();
								var active2 = TXCuoc.findOneAndUpdate({_id:obj._id}, {$set:{thanhtoan: true, win:true, betwin:obj.bet}}).exec();
								var active3 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{t_tong_thang_xu:obj.bet}}).exec();
								var active4 = TXCuocOne.findOneAndUpdate({uid: obj.uid, phien: game_id, taixiu:true, select:false, red:false}, {$set:{win:true}, $inc:{betwin:obj.bet}}).exec();
								return Promise.all([active1, active2, active3, active4])
							}else{
								var active1 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{t_tong_thua_xu:obj.bet}}).exec();
								var active2 = TXCuoc.findOneAndUpdate({_id:obj._id}, {$set:{thanhtoan: true}}).exec();
								return Promise.all([active1, active2])
							}
						}
					} else if (obj.taixiu == false && obj.red == true && obj.select == true) {  // Tổng Red Chẵn
						var win = dice%2 ? false : true;
						if (ChanLe_red_lech_chan && ChanLe_tong_red_lech > 0) {
							if (ChanLe_tong_red_lech >= obj.bet) {
								// Trả lại hoàn toàn
								ChanLe_tong_red_lech -= obj.bet
								// code trả lại hoàn toàn
								var active1 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:{red:obj.bet}}).exec();
								var active2 = TXCuoc.findOneAndUpdate({_id:obj._id}, {$set:{thanhtoan: true, win:win, tralai:obj.bet}}).exec();
								var active3 = TXCuocOne.findOneAndUpdate({uid: obj.uid, phien: game_id, taixiu:false, select:true, red:true}, {$set:{win:win}, $inc:{tralai:obj.bet}}).exec();
								return Promise.all([active1, active2, active3])
							}else{
								// Trả lại 1 phần
								// code trả lại 1 phần
								var betwin  = obj.bet-ChanLe_tong_red_lech;
								var betwinT = truChietKhau(betwin);
								var betwinP = win ? betwinT : 0;
								var active1 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:{red:ChanLe_tong_red_lech}}).exec();
								if (win) {
									// Thắng nhưng bị trừ tiền trả lại
									// code cộng tiền thắng
									var active_s1 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:{red:anPhanTram(betwin)}}).exec();
									var active_s2 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{c_tong_thang_red:betwinT}}).exec();
									var active2 = Promise.all([active_s1, active_s2])
								}else{
									var active2 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{c_tong_thua_red:betwin}}).exec();
								}
								var active3 = TXCuoc.findOneAndUpdate({_id:obj._id}, {$set:{thanhtoan: true, win:win, betwin: betwinP, tralai:ChanLe_tong_red_lech}}).exec();
								var active4 = TXCuocOne.findOneAndUpdate({uid: obj.uid, phien: game_id, taixiu:false, select:true, red:true}, {$set:{win:win}, $inc:{tralai:ChanLe_tong_red_lech, betwin:betwinP}}).exec();
								// code cập nhật tiền trả lại
								ChanLe_tong_red_lech = 0;
								return Promise.all([active1, active2, active3, active4])
							}
						}else{
							if (win) {
								// code cộng tiền thắng hoàn toàn
								var betwin  = truChietKhau(obj.bet);
								var active1 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:{red:anPhanTram(obj.bet)}}).exec();
								var active2 = TXCuoc.findOneAndUpdate({_id:obj._id}, {$set:{thanhtoan: true, win:true, betwin:betwin}}).exec();
								var active3 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{c_tong_thang_red:betwin}}).exec();
								var active4 = TXCuocOne.findOneAndUpdate({uid: obj.uid, phien: game_id, taixiu:false, select:true, red:true}, {$set:{win:true}, $inc:{betwin:betwin}}).exec();
								return Promise.all([active1, active2, active3, active4])
							}else{
								var active1 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{c_tong_thua_red:obj.bet}}).exec();
								var active2 = TXCuoc.findOneAndUpdate({_id:obj._id}, {$set:{thanhtoan: true}}).exec();
								return Promise.all([active1, active2])
							}
						}
					} else if (obj.taixiu == false && obj.red == true && obj.select == false) {  // Tổng Red Lẻ
						var win = dice%2 ? true : false;
						if (!ChanLe_red_lech_chan && ChanLe_tong_red_lech > 0) {
							if (ChanLe_tong_red_lech >= obj.bet) {
								// Trả lại hoàn toàn
								ChanLe_tong_red_lech -= obj.bet
								// code trả lại hoàn toàn
								var active1 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:{red:obj.bet}}).exec();
								var active2 = TXCuoc.findOneAndUpdate({_id:obj._id}, {$set:{thanhtoan: true, win:win, tralai:obj.bet}}).exec();
								var active3 = TXCuocOne.findOneAndUpdate({uid: obj.uid, phien: game_id, taixiu:false, select:false, red:true}, {$set:{win:win}, $inc:{tralai:obj.bet}}).exec();
								return Promise.all([active1, active2, active3])
							}else{
								// Trả lại 1 phần
								// code trả lại 1 phần
								var betwin  = obj.bet-ChanLe_tong_red_lech;
								var betwinT = truChietKhau(betwin);
								var betwinP = win ? betwinT : 0;
								var active1 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:{red:ChanLe_tong_red_lech}}).exec();
								if (win) {
									// Thắng nhưng bị trừ tiền trả lại
									// code cộng tiền thắng
									var active_s1 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:{red:anPhanTram(betwin)}}).exec();
									var active_s2 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{c_tong_thang_red:betwinT}}).exec();
									var active2 = Promise.all([active_s1, active_s2])
								}else{
									var active2 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{c_tong_thua_red:betwin}}).exec();
								}
								var active3 = TXCuoc.findOneAndUpdate({_id:obj._id}, {$set:{thanhtoan: true, win:win, betwin:betwinP, tralai:ChanLe_tong_red_lech}}).exec();
								var active4 = TXCuocOne.findOneAndUpdate({uid: obj.uid, phien: game_id, taixiu:false, select:false, red:true}, {$set:{win:win}, $inc:{tralai:ChanLe_tong_red_lech, betwin:betwinP}}).exec();
								// code cập nhật tiền trả lại
								ChanLe_tong_red_lech = 0;
								return Promise.all([active1, active2, active3, active4])
							}
						}else{
							if (win) {
								// code cộng tiền thắng hoàn toàn
								var betwin  = truChietKhau(obj.bet);
								var active1 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:{red:anPhanTram(obj.bet)}}).exec();
								var active2 = TXCuoc.findOneAndUpdate({_id:obj._id}, {$set:{thanhtoan: true, win:true, betwin:betwin}}).exec();
								var active3 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{c_tong_thang_red:betwin}}).exec();
								var active4 = TXCuocOne.findOneAndUpdate({uid: obj.uid, phien: game_id, taixiu:false, select:false, red:true}, {$set:{win:true}, $inc:{betwin:betwin}}).exec();
								return Promise.all([active1, active2, active3, active4])
							}else{
								var active1 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{c_tong_thua_red:obj.bet}}).exec();
								var active2 = TXCuoc.findOneAndUpdate({_id:obj._id}, {$set:{thanhtoan: true}}).exec();
								return Promise.all([active1, active2])
							}
						}
					} else if (obj.taixiu == false && obj.red == false && obj.select == true) {  // Tổng xu Chẵn
						var win = dice%2 ? false : true;
						if (ChanLe_xu_lech_chan && ChanLe_tong_xu_lech > 0) {
							if (ChanLe_tong_xu_lech >= obj.bet) {
								// Trả lại hoàn toàn
								ChanLe_tong_xu_lech -= obj.bet
								// code trả lại hoàn toàn
								var active1 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:{xu:obj.bet}}).exec();
								var active2 = TXCuoc.findOneAndUpdate({_id:obj._id}, {$set:{thanhtoan: true, win:win, tralai:obj.bet}}).exec();
								var active3 = TXCuocOne.findOneAndUpdate({uid: obj.uid, phien: game_id, taixiu:false, select:true, red:false}, {$set:{win:win}, $inc:{tralai:obj.bet}}).exec();
								return Promise.all([active1, active2, active3])
							}else{
								// Trả lại 1 phần
								// code trả lại 1 phần
								var betwin  = obj.bet-ChanLe_tong_xu_lech;
								var betwinT = win ? betwin : 0;
								var active1 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:{xu:ChanLe_tong_xu_lech}}).exec();
								if (win) {
									// Thắng nhưng bị trừ tiền trả lại
									// code cộng tiền thắng
									var x2 = betwin*2
									var active_s1 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:{xu:x2}}).exec();
									var active_s2 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{c_tong_thang_xu:betwin}}).exec();
									var active2   =  Promise.all([active_s1, active_s2])
								}else{
									var active2 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{c_tong_thua_xu:betwin}}).exec();
								}
								var active3 = TXCuoc.findOneAndUpdate({_id:obj._id}, {$set:{thanhtoan: true, win:win, betwin:betwinT, tralai:ChanLe_tong_xu_lech}}).exec();
								var active4 = TXCuocOne.findOneAndUpdate({uid: obj.uid, phien: game_id, taixiu:false, select:true, red:false}, {$set:{win:win}, $inc:{tralai:ChanLe_tong_xu_lech, betwin:betwinT}}).exec();
								// code cập nhật tiền trả lại
								ChanLe_tong_xu_lech = 0;
								return Promise.all([active1, active2, active3, active4])
							}
						}else{
							if (win) {
								// code cộng tiền thắng hoàn toàn
								var x2 = obj.bet*2
								var active1 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:{xu:x2}}).exec();
								var active2 = TXCuoc.findOneAndUpdate({_id:obj._id}, {$set:{thanhtoan: true, win:true, betwin:obj.bet}}).exec();
								var active3 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{c_tong_thang_xu:obj.bet}}).exec();
								var active4 = TXCuocOne.findOneAndUpdate({uid: obj.uid, phien: game_id, taixiu:false, select:true, red:false}, {$set:{win:true}, $inc:{betwin:obj.bet}}).exec();
								return Promise.all([active1, active2, active3, active4])
							}else{
								var active1 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{c_tong_thua_xu:obj.bet}}).exec();
								var active2 = TXCuoc.findOneAndUpdate({_id:obj._id}, {$set:{thanhtoan: true}}).exec();
								return Promise.all([active1, active2])
							}
						}
					} else if (obj.taixiu == false && obj.red == false && obj.select == false) { // Tổng xu Lẻ
						var win = dice%2 ? true : false;
						if (!ChanLe_xu_lech_chan && ChanLe_tong_xu_lech > 0) {
							if (ChanLe_tong_xu_lech >= obj.bet) {
								// Trả lại hoàn toàn
								ChanLe_tong_xu_lech -= obj.bet
								// code trả lại hoàn toàn
								var active1 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:{xu:obj.bet}}).exec();
								var active2 = TXCuoc.findOneAndUpdate({_id:obj._id}, {$set:{thanhtoan: true, win:win, tralai:obj.bet}}).exec();
								var active3 = TXCuocOne.findOneAndUpdate({uid: obj.uid, phien: game_id, taixiu:false, select:false, red:false}, {$set:{win:win}, $inc:{tralai:obj.bet}}).exec();
								return Promise.all([active1, active2, active3])
							}else{
								// Trả lại 1 phần
								// code trả lại 1 phần
								var betwin  = obj.bet-ChanLe_tong_xu_lech;
								var betwinT = win ? betwin : 0;
								var active1 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:{xu:ChanLe_tong_xu_lech}}).exec();
								if (win) {
								// Thắng nhưng bị trừ tiền trả lại
									// code cộng tiền thắng
									var x2 = betwin*2
									var active_s1 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:{xu:x2}}).exec();
									var active_s2 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{c_tong_thang_xu:betwin}}).exec();
									var active2   = Promise.all([active_s1, active_s2])
								}else{
									var active2 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{c_tong_thua_xu:betwin}}).exec();
								}
								var active3 = TXCuoc.findOneAndUpdate({_id:obj._id}, {$set:{thanhtoan: true, win:win, betwin:betwinT, tralai:ChanLe_tong_xu_lech}}).exec();
								var active4 = TXCuocOne.findOneAndUpdate({uid: obj.uid, phien: game_id, taixiu:false, select:false, red:false}, {$set:{win:win}, $inc:{tralai:ChanLe_tong_xu_lech, betwin:betwinT}}).exec();
								// code cập nhật tiền trả lại
								ChanLe_tong_xu_lech = 0;
								return Promise.all([active1, active2, active3, active4])
							}
						}else{
							if (win) {
								// code cộng tiền thắng hoàn toàn
								var x2 = obj.bet*2
								var active1 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:{xu:x2}}).exec();
								var active2 = TXCuoc.findOneAndUpdate({_id:obj._id}, {$set:{thanhtoan: true, win:true, betwin:obj.bet}}).exec();
								var active3 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{c_tong_thang_xu:obj.bet}}).exec();
								var active4 = TXCuocOne.findOneAndUpdate({uid: obj.uid, phien: game_id, taixiu:false, select:false, red:false}, {$set:{win:true}, $inc:{betwin:obj.bet}}).exec();
								return Promise.all([active1, active2, active3, active4])
							}else{
								var active1 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{c_tong_thua_xu:obj.bet}}).exec();
								var active2 = TXCuoc.findOneAndUpdate({_id:obj._id}, {$set:{thanhtoan: true}}).exec();
								return Promise.all([active1, active2])
							}
						}
					}
					return 1
				}))
				.then(function(arrayOfResults) {
					//Promise.all(arrayOfResults).then(function(data){
						playGame()
						setTaiXiu_user(game_id, dice)
					//})
				});

			}else{
				var temp_data = {taixiu:{taixiu:{red_tai: TaiXiu_red_tong_tai,red_xiu: TaiXiu_red_tong_xiu,xu_tai: TaiXiu_xu_tong_tai,xu_xiu: TaiXiu_xu_tong_xiu,red_player_tai: Object.keys(taixiu_red_player_tai_temp).length,red_player_xiu: Object.keys(taixiu_red_player_xiu_temp).length,xu_player_tai: Object.keys(taixiu_xu_player_tai_temp).length,xu_player_xiu: Object.keys(taixiu_xu_player_xiu_temp).length,},chanle:{red_chan: ChanLe_red_tong_chan,red_le: ChanLe_red_tong_le,xu_chan: ChanLe_xu_tong_chan,xu_le: ChanLe_xu_tong_le,red_player_chan: Object.keys(chanle_red_player_chan_temp).length,red_player_le: Object.keys(chanle_red_player_le_temp).length,xu_player_chan: Object.keys(chanle_xu_player_chan_temp).length,xu_player_le: Object.keys(chanle_xu_player_le_temp).length,}}};
				Promise.all(Object.values(io.nsps['/users'].sockets).filter(function(obj){
					if (obj.UID !== void 0 && obj.auth && obj.gameEvent !== void 0 && obj.gameEvent.viewTaiXiu !== void 0 && obj.gameEvent.viewTaiXiu)
						io.nsps['/users'].to(obj.id).emit('p', temp_data);
				}));
				Promise.all(Object.values(io.nsps['/admin'].sockets).filter(function(a_obj){
					if (a_obj.UID !== void 0 && a_obj.auth && a_obj.gameEvent !== void 0 && a_obj.gameEvent.viewTaiXiu !== void 0 && a_obj.gameEvent.viewTaiXiu)
						io.nsps['/admin'].to(a_obj.id).emit('p', temp_data);
				}));
			}
		}, reason => {
			console.log(reason)
		});
	});
}

function playGame(){
	io.TaiXiu_time = 82
	//io.TaiXiu_time = 10

	gameLoop = setInterval( async function(){
		io.TaiXiu_time--;
		//console.log(io.TaiXiu_time);
		if (io.TaiXiu_time <= 60) {
			if (io.TaiXiu_time < 0) {
				clearInterval(gameLoop);
				io.TaiXiu_time = 0;

				var file  = require(dataTaiXiu);

				var dice1 = parseInt(file.dice1 == 0 ? Math.floor(Math.random() * 6) + 1 : file.dice1);
				var dice2 = parseInt(file.dice2 == 0 ? Math.floor(Math.random() * 6) + 1 : file.dice2);
				var dice3 = parseInt(file.dice3 == 0 ? Math.floor(Math.random() * 6) + 1 : file.dice3);

				file.dice1  = 0;
				file.dice2  = 0;
				file.dice3  = 0;
				file.uid    = "";
				file.rights = 2;

				fs.writeFile(dataTaiXiu, JSON.stringify(file), function(err){});

				try {
					const create = await TXPhien.create({'dice1':dice1, 'dice2':dice2, 'dice3':dice3, 'time':new Date()})
					if (!!create) {
						phien = create.id+1
						var chothanhtoan = await thongtin_thanhtoan(create.id, dice1+dice2+dice3)
						io.nsps['/users'].emit('p', {taixiu: {finish:{dices:[create.dice1, create.dice2, create.dice3], phien:create.id}}})
						io.nsps['/admin'].emit('p', {taixiu: {finish:{dices:[create.dice1, create.dice2, create.dice3], phien:create.id}}})
					}
				} catch (err) {
					console.log(err)
				}
			}else
				thongtin_thanhtoan(phien)
		}

	}, 1000)
	return gameLoop
}

module.exports = init
