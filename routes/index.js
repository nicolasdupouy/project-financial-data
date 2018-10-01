const express = require('express');
const router  = express.Router();
const Indice = require('../models/indice.js');

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/indice', (req, res, next) => {
  // Indice.findOne({"_id":"5bad2582ded6ca2c4021b221"})
  Indice.find()
  .then(indices => {
    // console.log(indice.Symbol)
    var listUdl=[]
    var listnameudl=[]
    for (ind=0;ind<indices.length;ind++) {
      // listUdl.push(indices[ind].Symbol)
      // listnameudl.push(indices[ind].Product)
      listUdl.push(indices[ind].Symbol+' '+indices[ind].Product)
      // listUdl.push([indices[ind].Symbol,indices[ind].Product])
      // listnameudl.push(indices[ind].Product)
    }
    // var uniquelistUdl=[...new Set(listUdl)]
    var uniquelistUdl = listUdl.filter(function(item, pos) {
      return listUdl.indexOf(item) == pos;
  })
    indiceCode=uniquelistUdl.map(o=>o.split(" ")[0])
    indiceName=uniquelistUdl.map(o=>o.split(" ").slice(1).join(" "))
    res.render('indice',{indiceCode})
  })
});

module.exports = router;
