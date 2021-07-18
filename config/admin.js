
// Khởi tạo dữ liệu

// Admin
const Admin   = require('../app/Models/Admin');
const helpers = require('../app/Helpers/Helpers');

Admin.estimatedDocumentCount().exec(function(err, total){
	if (total == 0) {
		Admin.create({'username': 'admin', 'password': helpers.generateHash('12345'), 'rights': 9, 'regDate': new Date()});
	}
})

// thiết lập game miniPoker
const miniPokerHu = require('../app/Models/miniPoker/miniPokerHu');

miniPokerHu.findOne({type:100}, {}, function(err, data){
	if (!data) {
		miniPokerHu.create({'type': 100, red: true, 'bet': 499000, 'min': 450000});
	}
})

miniPokerHu.findOne({type:1000}, {}, function(err, data){
	if (!data) {
		miniPokerHu.create({'type': 1000, red: true, 'bet': 4990000, 'min': 4500000});
	}
})

miniPokerHu.findOne({type:1000}, {}, function(err, data){
	if (!data) {
		miniPokerHu.create({'type': 10000, red: true, 'bet': 49900000, 'min': 45000000});
	}
})

miniPokerHu.findOne({type:100}, {}, function(err, data){
	if (!data) {
		miniPokerHu.create({'type': 100, red: false, 'bet': 499000, 'min': 450000});
	}
})

miniPokerHu.findOne({type:1000}, {}, function(err, data){
	if (!data) {
		miniPokerHu.create({'type': 1000, red: false, 'bet': 4990000, 'min': 4500000});
	}
})

miniPokerHu.findOne({type:1000}, {}, function(err, data){
	if (!data) {
		miniPokerHu.create({'type': 10000, red: false, 'bet': 49900000, 'min': 45000000});
	}
})

