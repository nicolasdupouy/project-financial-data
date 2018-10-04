
let getGraphPrice = function (udl) {
	axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=${udl}&apikey=N9YS4NQTUH5VJ8WV`)
		.then(response => {
			let labelData = Object.keys(response.data['Monthly Adjusted Time Series']);
			console.log('labelData', labelData)
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
			console.log('valuesData', valuesData)
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
	axios.get(`http://localhost:3000/api/totalvolume/${udl}`)
		.then(response => {
			// var result = _.sortBy(Object.values(response.data), o => o[0])
			// console.log(result)
			var result = Object.values(response.data)
			console.log('result', result[0])
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

let getGraphADV = function (udl) {
	axios.get(`http://localhost:3000/api/adv/${udl}`)
		.then(response => {
			// var result = _.sortBy(Object.values(response.data), o => o[0])
			// console.log(result)
			var result = Object.values(response.data)
			console.log('result', result[0])
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


document.getElementById("udl-selected").onchange = function (e) {
	udl = e.target.value;
	console.log(udl)
	// window.location
	getDescription(udl)
	getGraphPrice(udl)
	getGraphTotalVolume(udl)
	getGraphADV(udl)
	
}