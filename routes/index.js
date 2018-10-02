const express = require('express');
const router = express.Router();
const Indice = require('../models/indice.js');
const Highcharts=require('highcharts/highstock');

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/indice', (req, res, next) => {
  // Indice.findOne({"_id":"5bad2582ded6ca2c4021b221"})
  Indice.find()
    .then(indices => {
      var listUdl = []
      for (ind = 0; ind < indices.length; ind++) {
        listUdl.push(indices[ind].Symbol + ' ' + indices[ind].Product)
      }
      // var uniquelistUdl=[...new Set(listUdl)]
      var uniquelistUdl = listUdl.filter(function (item, pos) {
        return listUdl.indexOf(item) == pos;
      })
      let indiceCode = uniquelistUdl.map(o => o.split(" ")[0])
      let indiceName = uniquelistUdl.map(o => o.split(" ").slice(1).join(" "))
      let dictIndice = []
      for (ind = 0; ind < indiceCode.length; ind++) {
        dictIndice.push({
          key: indiceCode[ind],
          value: indiceName[ind]
        })
      }
      // console.log("dictionnaire", dictIndice)
      res.render('indice', { dictIndice })
    })
});


router.get('/indice/:id',(req,res,next)=>{

  // document.getElementById('start').onchange = function(e) {
  //   console.log(e);
  //   start = e.target.value;
  //   getGraph(start,end,ccy)
  // }
  let indiceCode=req.params.id
  console.log("code",indiceCode)
  Indice.find({'Symbol': indiceCode})
    .then(data => {
      let dataChart=[]
      for (ind = 0; ind < data.length; ind++) {
        dataChart.push([data[ind].MONTH,data[ind]["Total Volume"]])
      }
      console.log(typeof(dataChart),dataChart.sort())
      // months=data.MONTH
      // volume=data["Total Volume"]
      // console.log(months,volume)

      var config= {
        rangeSelector: {
            selected: 1
        },
        series: [{
            name: data.Symbol,
            data:dataChart,
            tooltip: {
              valueDecimals: 2
          }
        }],
        // xAxis:{
        // 	categories:labelData
        // },
        title: {
          text: 'MSFT Evolution'
      },
              
    };
    
    
    let secondchart= new Highcharts.stockChart('myChart', config)
      res.render('chart',{data,secondchart})
    })
    .catch(error => {
      console.log(error)
    })
  
})

module.exports = router;
