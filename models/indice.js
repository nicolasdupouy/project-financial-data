const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const indiceSchema = new Schema({
  Symbol: String,
  Product: String,
  "Total Volume": Number,
  "Average Daily Volume": Number,
  "%Change vs same Month last year":Number,
  "%Change vs last Month": Number,
  "YTD Total Volume": Number,
  "YTD Average Daily Volume": Number,
  "YTD % Change vs same Month last year": Number,
  "Open Interest": Number,
  "OI % Change vs last year": Number,
  MONTH: String,
  YEAR: String,

});

const Indice = mongoose.model("Cboedata", indiceSchema);

module.exports = Indice;