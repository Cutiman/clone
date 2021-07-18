
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CounterSchema = new Schema({
	_id:  String,
	next: Number,
});

Counters.statics.findAndModify = function (query, sort, doc, options, callback) {
  return this.collection.findAndModify(query, sort, doc, options, callback);
};

Counters.statics.increment = function (counter, callback) {
  return this.collection.findAndModify({ _id: counter }, [], { $inc: { next: 1 } }, callback);
};

const Counter = mongoose.model("Counter", CounterSchema);
module.exports = Counter;
