const express = require('express');
const router = express.Router();
const Indice = require('../models/indice.js');
const GlobalVolume = require('../models/variation.js');

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
      // console.log('sorted datachart', dataChart.sort())
      dataChart.sort()
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

router.get('/api/globalview/:id', (req, res, next) => {
  let udlCode = req.params.id
  console.log("code", udlCode)
  GlobalVolume.findOne({ 'Symbol': udlCode })
    .then(data => {
      totalData = data
      console.log("index.js GlobalVolume", totalData)
      res.json({ totalData })
    })
})

router.get('/api/volumemonth/:id', (req, res, next) => {
  let indiceCode = req.params.id
  console.log("code", indiceCode)
  Indice.find({ 'Symbol': indiceCode })
    .then(data => {
      let dataChart = []
      for (ind = 0; ind < data.length; ind++) {
        // dataChart.push([monthstring.findIndex(data[ind].MONTH)+' '+data[ind].YEAR, data[ind]["Total Volume"]])
        dataChart.push([data[ind].Symbol, data[ind].MONTH, data[ind].YEAR, data[ind]["Total Volume"]])
      }
      // // console.log('sorted datachart', dataChart.sort())
      // dataChart.sort()
      res.json({ dataChart })
    })
})

const fs = require('fs');
const { exec } = require('child_process');

router.get('/calculation', (req, res, next) => {
  res.render('calculation')
})

router.get('/api/calculation-form/:function/udl/:id', (req, res, next) => {
  let udlname = req.params.id;
  let functioncalc = req.params.function;
  header = "import pandas as pd\r\n" +
    "from os import listdir\r\n" +
    "from os.path import isfile, join\r\n" +
    "monRepertoire=\"C:/Users/Hanane/Documents/Cours/IronHack/Project/financial-data/documents/global\"\r\n" +
    'f="GLOBAL_DATA.xls"\r\n' +
    'df=pd.read_excel(join(monRepertoire,f))\r\n' +
    "months={'JANUARY':1,'FEBRUARY':2,'MARCH':3,'APRIL':4,'MAY':5,'JUNE':6,'JULY':7,'AUGUST':8,'SEPTEMBER':9,'OCTOBER':10,'NOVEMBER':11,'DECEMBER':12}\r\n" +
    "df['MONTHNB']=df.MONTH.map(months)\r\n" +
    "df['YEARMONTH']=df['YEAR'].astype(str)+' '+df['MONTHNB'].astype(str)\r\n" +
    "df=df.sort_values(['YEAR','MONTHNB'])\r\n"
  // "print(df.head(5))"


  // console.log('valuescript', valuescript.scriptpython)
  // array_script = valuescript.scriptpython.split(' ')
  // if (array_script[0] == "cumsum") {
  //   udl = array_script[1]
  // }
  console.log(functioncalc)
  if (functioncalc == "cumsum") {
    header += `df['CUMSUM']=df.groupby('Symbol')['Total Volume'].${functioncalc}().fillna(0)\r\n` +
      `print(df[df['Symbol']=='${udlname}'][['YEARMONTH','CUMSUM']].to_json(orient='values'))`
  } else {
    header += `dfmva=df.groupby('Symbol')['Total Volume'].${functioncalc}().reset_index().fillna(0)\r\n` +
    `dfnew1=dfmva[dfmva['Symbol']=='${udlname}']\r\n`+
    `dfnew2=pd.DataFrame(df[df['Symbol']=='${udlname}']['YEARMONTH']).reset_index().drop("index",axis=1)\r\n`+
    'dfresult=pd.merge(dfnew1,dfnew2,on=dfnew1.index).drop(["key_0","level_1"],axis=1)[["YEARMONTH","Total Volume"]]\r\n'+
    'print(dfresult.to_json(orient="values"))'
  }
  // df['CUMSUM']=df.groupby("Symbol")['Total Volume'].cumsum()#.reset_index()['Total Volume']
  // dfmva=df.groupby('Symbol')['Total Volume'].rolling(3).mean().reset_index().fillna(0)
  // dfstd=df.groupby('Symbol')['Total Volume'].rolling(3).std().reset_index().fillna(0)

  console.log('value script', header)
  fs.writeFile("C:/Users/Hanane/Documents/script.py", header, function (err) {
    if (err) {
      return console.log(err);
    }
    console.log("The file was saved!");
  });
  // C:/Users/Hanane/Anaconda3/python.exe
  exec('C:/Users/Hanane/Anaconda3/python.exe C:/Users/Hanane/Documents/script.py', (err, stdout, stderr) => {
    if (err) {
      console.error(`exec error: ${err}`);
      return;
    }
    console.log(`Number of files ${stdout}`);
    // values=Object.values (stdout)
    // console.log('values of json',stdout.split(']'))
    // res.render('calculation',{stdout})
    res.json({ stdout })
    // values2=value
    // console.log('values2 of json',values2)
  });

}
)

// router.get('/calculation-form', (req, res, next) => {
//   // console.log('req',req)
//   let valuescript = req.query;
//   console.log('valuescript', valuescript)
//   // req.body;


// })


// router.get('/calculation-form', () => {
//   res.render('calculation')
// })

module.exports = router;
