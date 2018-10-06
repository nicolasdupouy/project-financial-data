const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

// const indiceSchema = new Schema({
//   YEAR: Number,
//   JANUARY:Number,
//   FEBRUARY:Number,
// MARCH:Number,
// APRIL:Number,
// MAY:Number,
// JUNE:Number,
// JULY: Number,
// AUGUST: Number,
// SEPTEMBER: Number,
// OCTOBER: Number,
// NOVEMBER: Number,
// DECEMBER: Number});

const totalVolumeSchema= new Schema({
  Symbol: String,
  2014: Number,
  2015: Number,
  2016: Number,
  2017: Number
})


const GlobalVolume = mongoose.model("Totalvolume", totalVolumeSchema);

module.exports = GlobalVolume;