
const Admin    = require('./Admin')
const Users    = require('./panel/Users')
const NapThe   = require('./panel/NapThe')
const MuaThe   = require('./panel/MuaThe')
const Shop     = require('./panel/Shop')
const GiftCode = require('./panel/GiftCode')

const TaiXiu = require('./game/taixiu')

module.exports = function(client, data) {
	if (client.auth && client.UID) {
		if (void 0 !== data.admin) {
			Admin.onData(client, data.admin)
		}
		if (void 0 !== data.taixiu) {
			TaiXiu(client, data.taixiu)
		}
		if (void 0 !== data.nap_the) {
			NapThe.onData(client, data.nap_the)
		}
		if (void 0 !== data.mua_the) {
			MuaThe.onData(client, data.mua_the)
		}

		if (void 0 !== data.users) {
			Users.onData(client, data.users)
		}

		if (void 0 !== data.shop) {
			Shop.onData(client, data.shop)
		}

		if (void 0 !== data.giftcode){
			GiftCode.onData(client, data.giftcode);
		}
	}
}
