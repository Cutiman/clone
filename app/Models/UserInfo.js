
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose);

const UserInfoSchema = new Schema({
	id:         { type: String, required: true, unique: true },
	name:       { type: String, unique: true },

	avatar:     {type: String, default: ''},

	joinedOn:   {type: Date, default: new Date()},

	birthyeah:  {type: Number, default: 0},
	birthmonth: {type: Number, default: 0},
	birthday:   {type: Number, default: 0},

	phone:      {type: String, default: ''},
	email:      {type: String, default: ''},
	cmt:        {type: String, default: ''},
	security:   {
		login:       {type: Number, default: 0},

		xito:        {type: Number, default: 0},
		bacay:       {type: Number, default: 0},
		poker:       {type: Number, default: 0},
		lieng:       {type: Number, default: 0},
		phom:        {type: Number, default: 0},
		tienlenMN:   {type: Number, default: 0},
		tienlenSolo: {type: Number, default: 0},
		sam:         {type: Number, default: 0},
		samSolo:     {type: Number, default: 0},
		maubinh:     {type: Number, default: 0},
		chan:        {type: Number, default: 0},
	},

	exp:        {type: Number, default: 0},
	red:        {type: Number, default: 0},
	xu:         {type: Number, default: 50000},
	ketSat:     {type: Number, default: 0},

	red_win:    {type: Number, default: 0},
	xu_win:     {type: Number, default: 0},
	red_lost:   {type: Number, default: 0},
	xu_lost:    {type: Number, default: 0},

	slot_win:   {type: Number, default: 0},
	slot_lost:  {type: Number, default: 0},

	win:        {type: Number, default: 0},
	lost:       {type: Number, default: 0},
});

UserInfoSchema.plugin(autoIncrement.plugin, {model:'UserInfo', field:'UID', startAt:1});

const UserInfo = mongoose.model("UserInfo", UserInfoSchema);
module.exports = UserInfo;
