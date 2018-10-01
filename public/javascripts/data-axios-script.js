let udl=""


axios.get('https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=MSFT&apikey=N9YS4NQTUH5VJ8WV')
.then(response	 => {
let labelData=Object.keys(response.data['Monthly Adjusted Time Series']);
console.log(labelData)
let valuesData =Object.values(response.data["Monthly Adjusted Time Series"])
	.map((o,i)=>
		[	
			moment(Object.keys(response.data["Monthly Adjusted Time Series"])[i]).valueOf(),
			parseFloat(o['1. open'])
		]);
// let valuesData2 =Object.values(response.data["Monthly Adjusted Time Series"]).map(o=>o['2. high']);
// let valuesData3 =Object.values(response.data["Monthly Adjusted Time Series"]).map(o=>o['6. volume']);
// let dataset=response.data["Monthly Adjusted Time Series"]
// console.log(valuesData)

var config= {
		rangeSelector: {
				selected: 1
		},
		series: [{
				name: 'MSFT',
				data: valuesData.reverse(),
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

})

