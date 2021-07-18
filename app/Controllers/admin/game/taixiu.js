
const TaiXiu_setDice = require('./taixiu/set_dice.js')

module.exports = function(client, data) {
	if (client.auth && client.UID) {
		if (void 0 !== data.view) {
			client.gameEvent.viewTaiXiu = !!data.view
		}
		if (void 0 !== data.set_dice) {
			TaiXiu_setDice(client, data.set_dice);
		}
		if (void 0 !== data.getLogs) {
			//TaiXiu.getLogs(client);
		}
		if (void 0 !== data.cuoc) {
			//TaiXiu.cuoc(client, data.cuoc);
		}
		if (void 0 !== data.chat) {
			//TaiXiu.chat(client, data.chat);
		}
		if (void 0 !== data.get_phien) {
			//TaiXiu.get_phien(client, data.get_phien);
		}
		if (void 0 !== data.get_log) {
			//TaiXiu.get_log(client, data.get_log);
		}
		if (void 0 !== data.get_top) {
			//TaiXiu.get_top(client, data.get_top);
		}
		if (void 0 !== data.get_new) {
			//TaiXiu.getNew(client);
		}
	}
}
