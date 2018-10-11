
let getScriptPythonOutput = function (functname,udl) {
	axios.get(`/api/calculation-form/${functname}/udl/${udl}`)
		.then(response => {
			// var result = _.sortBy(Object.values(response.data), o => o[0])
			// console.log(result)
			let result = Object.values(response.data)
      console.log('script result', response.data.stdout)
      let arrayjson=result[0].split('[')
      arrayjson=arrayjson.map(x=>x.split("]"))
      let newarray=[]
      for (i=0;i<arrayjson.length;i++){
        newarray.push([arrayjson[i][0].split(',')[0].split('"'),parseFloat(arrayjson[i][0].split(',')[1])])
      }
      console.log("new array",newarray)
      let secondarray=[]
      // let datesarray=[]
      let chartarray=[]
      for (i=2;i<newarray.length;i++){

        secondarray.push([newarray[i][0][1].split(' '),newarray[i][1]])
        yeararr=parseInt(newarray[i][0][1].split(' ')[0])
        montharr=parseInt(newarray[i][0][1].split(' ')[1])
        // datesarray.push(Date.parse(yeararr+' '+montharr))
        chartarray.push([Date.parse(yeararr+' '+montharr),newarray[i][1]])
        // datesarray.push([parseInt(newarray[i][0][1].split(' ')[0]),parseInt(newarray[i][0][1].split(' ')[1])])
    
      }
      console.log("new array",chartarray)
      // console.log("new array",newarray)
      // dataChart.push([Date.parse(data[ind].MONTH + ' ' + data[ind].YEAR), data[ind]["Total Volume"]])
			var config = graphConfig(6, `${udl} ${functname.toUpperCase()} Volume`, chartarray)
      let secondchart = new Highcharts.stockChart('mychart-script', config)
      
      $("#mytable-script").html("")

			document.getElementById('mytable-script').innerHTML += `<h2>${udl} ${functname.toUpperCase()} CALCULATION</h2>`
			document.getElementById('mytable-script').innerHTML += "<table id='mytable-vol-script'></table>"
			let headertable = `<th>YEAR</th><th>MONTH</th><th>${functname}</th>`;
      let bodytable = "";
      let floatnumber=0;
			for (i = 0; i < secondarray.length; i++) {
            floatnumber=parseFloat(secondarray[i][1].toFixed(0))
            // floatnumber.toLocaleString(undefined, { minimumFractionDigits: 0 })
						bodytable += `<tr><td>${secondarray[i][0][0]}</td><td>${secondarray[i][0][1]}</td><td>${floatnumber.toLocaleString(undefined, { minimumFractionDigits: 0 })}</td></tr>`
					}

			document.getElementById('mytable-vol-script').innerHTML += "<thead id='mytable-vol-head'>" + headertable + "</thead><tbody>" + bodytable + "</tbody>"
			$('#mytable-vol-script').DataTable();


		})
	}



document.getElementById('script').onchange = function (e){
  let valuescript = e.target.value;
  console.log('e value',valuescript)
  let array_script = valuescript.split(' ')
  let functname=array_script[0];

  if (functname == "cumsum") {
    udl = array_script[1]
  }else if (functname == "rolling") {
    functname="rolling("+array_script[1]+")."+array_script[2]
    udl = array_script[3]
  }

	getScriptPythonOutput(functname,udl)
}
