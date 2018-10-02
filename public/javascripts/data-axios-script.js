// axios.get('https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=MSFT&apikey=N9YS4NQTUH5VJ8WV')
// .then(response	 => {
// let labelData=Object.keys(response.data['Monthly Adjusted Time Series']);
// console.log('labelData',labelData)
// let valuesData =Object.values(response.data["Monthly Adjusted Time Series"])
// 	.map((o,i)=>
// 		[	
// 			moment(Object.keys(response.data["Monthly Adjusted Time Series"])[i]).valueOf(),
// 			parseFloat(o['1. open'])
// 		]);
// // let valuesData2 =Object.values(response.data["Monthly Adjusted Time Series"]).map(o=>o['2. high']);
// // let valuesData3 =Object.values(response.data["Monthly Adjusted Time Series"]).map(o=>o['6. volume']);
// // let dataset=response.data["Monthly Adjusted Time Series"]
// // console.log(valuesData)
// console.log('valuesData',valuesData)
// var config= {
// 		rangeSelector: {
// 				selected: 1
// 		},
// 		series: [{
// 				name: 'MSFT',
// 				data: valuesData.reverse(),
// 				tooltip: {
// 					valueDecimals: 2
// 			}
// 		}],
// 		// xAxis:{
// 		// 	categories:labelData
// 		// },
// 		title: {
// 			text: 'MSFT Evolution'
// 	},

// };


// let secondchart= new Highcharts.stockChart('myChart', config)

// })



let getGraph = function (udl) {

	axios.get(`http://localhost:3000/api/indice/${udl}`)
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
					name: 'SPX',
					data: result[0],
					tooltip: {
						valueDecimals: 2
					}
				}],
				// xAxis:{
				// 	categories:labelData
				// },
				title: {
					text: 'SPX Evolution'
				},

			};


			let secondchart = new Highcharts.stockChart('myChart2', config)

		})
}


document.getElementById("udl-selected").onchange = function (e) {
	udl = e.target.value;
	console.log(udl)
	// window.location
	getGraph(udl)
}