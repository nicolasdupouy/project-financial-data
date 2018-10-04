let getGraphPrice = function (udl) {
	axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=${udl}&apikey=N9YS4NQTUH5VJ8WV`)
		.then(response => {
			// let labelData = Object.keys(response.data['Monthly Adjusted Time Series']);
			// console.log('labelData', labelData)
			let valuesData = Object.values(response.data["Monthly Adjusted Time Series"])
				.map((o, i) =>
					[
						moment(Object.keys(response.data["Monthly Adjusted Time Series"])[i]).valueOf(),
						parseFloat(o['1. open'])
					]);
			// let valuesData2 =Object.values(response.data["Monthly Adjusted Time Series"]).map(o=>o['2. high']);
			// let valuesData3 =Object.values(response.data["Monthly Adjusted Time Series"]).map(o=>o['6. volume']);
			// let dataset=response.data["Monthly Adjusted Time Series"]
			// console.log(valuesData)
			// console.log('valuesData', valuesData)
			var config = {
				rangeSelector: {
					selected: 6
				},
				series: [{
					name: `${udl} Price Evolution`,
					data: valuesData.reverse(),
					tooltip: {
						valueDecimals: 2
					}
				}],
				// xAxis:{
				// 	categories:labelData
				// },
				title: {
					text: `${udl} Price Evolution`
				},

			};


			let secondchart = new Highcharts.stockChart('myChartPrice', config)

		})

}

let getGraphTotalVolume = function (udl) {
	console.log("udl", udl)
	axios.get(`http://localhost:3000/api/totalvolume/${udl}`)
		.then(response => {
			// var result = _.sortBy(Object.values(response.data), o => o[0])
			// console.log(result)
			var result = Object.values(response.data)
			// console.log('result', result[0])
			var config = {
				rangeSelector: {
					selected: 6
				},
				series: [{
					name: udl,
					data: result[0],
					tooltip: {
						valueDecimals: 2
					}
				}],
				title: {
					text: `${udl} Total Volume Evolution`
				},

			};
			let secondchart = new Highcharts.stockChart('myChartTotalVolume', config)
		})
}

let getGraphADV = function (udl,startDate,endDate) {
	axios.get(`http://localhost:3000/api/adv/${udl}`)
		.then(response => {
			// var result = _.sortBy(Object.values(response.data), o => o[0])
			// console.log(result)
			var result = Object.values(response.data)
			console.log("result before rangedate",result[0])
			console.log("test",result[0].map(o=>o[0]>=startDate && o[0]<=endDate ))
			resultRangeDates=result[0].filter(o=>o[0]>=startDate && o[0]<=endDate )
			console.log("resultRangeDates",resultRangeDates)
			// resultRangeDates=resultRangeDates.filter(o=>o[0]<=endDate)
			
			// console.log('result ADV', result[0])
			console.log('resultRangeDates ADV', resultRangeDates)
			var config = {
				rangeSelector: {
					selected: 6
				},
				series: [{
					name: udl,
					data: result[0],
					tooltip: {
						valueDecimals: 2
					}
				}],
				title: {
					text: `${udl} Average Daily Volume Evolution`
				},

			};
			let secondchart = new Highcharts.stockChart('myChartADV', config)
		})
}

let getDescription = function (udl) {
	axios.get(`http://localhost:3000/api/udl/desc/${udl}`)
		.then(response => {
			// var result = _.sortBy(Object.values(response.data), o => o[0])
			// console.log(result)
			var result = Object.values(response.data)
			console.log('result des', response.data)
			console.log('description', result[0])
			document.getElementById('udl-description').innerHTML = result[0]
		})
}

document.getElementById("lower").onchange = function (e) {
	dateLower = e.target.value;
	startDatems=(dateLower*(1538517600000-951692400000))/100+951692400000
	var startDate = new Date(startDatems)
	startDate=moment(startDate).format("MMM Do YYYY");
	document.getElementById("start-date").innerHTML=startDate; 
	udl=document.getElementById("udl-selected").value
	endDate=document.getElementById("end-date");
	console.log('lower date and udl',endDate,udl)
	getGraphPrice(udl)
	getGraphTotalVolume(udl)
	getGraphADV(udl,startDatems,endDate)
}

document.getElementById("upper").onchange = function (e) {
	dateUpper = e.target.value;
	endDatems=(dateUpper*(1538517600000-951692400000))/100+951692400000
	var endDate = new Date(endDatems)
	endDate=moment(endDate).format("MMM Do YYYY");
	document.getElementById("end-date").innerHTML=endDate;
	udl=document.getElementById("udl-selected").value
	console.log("hihi",document.getElementById("udl-selected"))
	startDate=moment(document.getElementById("start-date").innerText).format("MMM Do YYYY");
	console.log('upper date and udl',endDate,udl)
	getGraphPrice(udl)
	getGraphTotalVolume(udl)
	getGraphADV(udl,startDate,endDate) 
}

document.getElementById("udl-selected").onchange = function (e) {
	udl = e.target.value;
	startDate=document.getElementById("start-date").innerHTML
	endDate=document.getElementById("end-date").innerHTML
	// console.log(udl)
	// window.location
	getDescription(udl)
	getGraphPrice(udl)
	getGraphTotalVolume(udl)
	getGraphADV(udl,startDate,endDate)
}