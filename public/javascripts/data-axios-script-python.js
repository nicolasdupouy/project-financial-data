
let getScriptPythonOutput = function (functname,udl) {
	axios.get(`/api/calculation-form/${functname}/udl/${udl}`)
		.then(response => {
			// var result = _.sortBy(Object.values(response.data), o => o[0])
			// console.log(result)
			let result = Object.values(response.data)
      console.log('script result', response.data.stdout)
      let arrayjson=result[0].split('[')
      console.log('first split',arrayjson)
      arrayjson=arrayjson.map(x=>x.split("]"))
      arrayjson=arrayjson.filter(x=>x!=",")
      console.log('second split',arrayjson)
      // arrayjson=arrayjson.map((x,i)=>x[i].split(","))
      console.log('result',arrayjson[2][0].split(','))
      document.getElementById("container-json").innerHTML=response.data
		})
	}

document.getElementById('script').onchange = function (e){
  let valuescript = e.target.value;
  console.log('e value',valuescript)
  let array_script = valuescript.split(' ')
  let functname=array_script[0];
  if (functname == "cumsum") {
    udl = array_script[1]
  }

	getScriptPythonOutput(functname,udl)
}
