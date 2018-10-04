const express = require('express');
const router = express.Router();
const Indice = require('../models/indice.js');
// const Highcharts=require('highcharts/highstock');

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/chart', (req, res, next) => {
  // Indice.findOne({"_id":"5bad2582ded6ca2c4021b221"})
  Indice.find()
    .then(indices => {
      var listUdl = []
      for (ind = 0; ind < indices.length; ind++) {
        // listUdl.push(indices[ind].Symbol + ' ' + indices[ind].Product)
        listUdl.push(indices[ind].Symbol)
      }
      var uniquelistUdl = [...new Set(listUdl)]
      console.log("unique list udl", uniquelistUdl)
      // var uniquelistUdl = listUdl.filter(function (item, pos) {
      //   return listUdl.indexOf(item) == pos;
      // })
      // let indiceCode = uniquelistUdl.map(o => o.split(" ")[0])
      // let indiceName = uniquelistUdl.map(o => o.split(" ").slice(1).join(" "))
      // let dictIndice = []
      // for (ind = 0; ind < indiceCode.length; ind++) {
      //   dictIndice.push({
      //     key: indiceCode[ind],
      //     value: indiceName[ind]
      //   })
      // }
      // res.render('chart', { dictIndice })
      res.render('chart', { uniquelistUdl })
    })
});


router.get('/api/totalvolume/:id', (req, res, next) => {
  let indiceCode = req.params.id
  console.log("code", indiceCode)
  Indice.find({ 'Symbol': indiceCode })
    .then(data => {
      let dataChart = []
      // let monthstring=['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER']
      // let monthnumber=[1,2,3,4,5,6,7,8,9,10,11,12]
      // monthnumber.push(i for (i=1;i<=12;i++))
      // let months=[[]]
      // let dictMonth={
      //   monthstring:monthnumber
      // }
      for (ind = 0; ind < data.length; ind++) {
        // dataChart.push([monthstring.findIndex(data[ind].MONTH)+' '+data[ind].YEAR, data[ind]["Total Volume"]])
        dataChart.push([Date.parse(data[ind].MONTH + ' ' + data[ind].YEAR), data[ind]["Total Volume"]])

      }
      console.log('sorted datachart', dataChart.sort())
      res.json({ dataChart })
    })
})


router.get('/api/adv/:id', (req, res, next) => {
  let indiceCode = req.params.id
  console.log("code", indiceCode)
  Indice.find({ 'Symbol': indiceCode })
    .then(data => {
      let dataChart = []
      for (ind = 0; ind < data.length; ind++) {
        dataChart.push([Date.parse(data[ind].MONTH + ' ' + data[ind].YEAR), data[ind]["Average Daily Volume"]])

      }
      console.log('sorted datachart', dataChart.sort())
      res.json({ dataChart })
    })
})

// router.get('/chart', (req, res, next) => {
//   res.render('chart')
// })

router.get('/api/udl/desc/:id', (req, res, next) => {
  let indiceCode = req.params.id
  console.log("code", indiceCode)
  Indice.findOne({ 'Symbol': indiceCode })
    .then(data => {
      indiceName = data.Product
      res.json({ indiceName })
    })
})

module.exports = router;
