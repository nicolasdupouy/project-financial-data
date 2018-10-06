let getDatesRange = function (array, startDate, endDate) {
	lengthRes = array.length
	if (endDate == "" || isNaN(endDate)) {
		endDate = array[lengthRes - 1][0]
	}
	initialDate = array[0][0]
	if (startDate <= initialDate || isNaN(startDate)) {
		startDate = initialDate
	}
	return [startDate, endDate]
}

let graphConfig = function (Rangeselector, name, dataset) {
	var config = {
		rangeSelector: {
			// selected: 6
			selected: Rangeselector
		},
		series: [{
			name: name,
			data: dataset,
			tooltip: {
				valueDecimals: 2
			}
		}],
		title: {
			text: name
		},

	};
	return config
}

let getDatetoMillisec = function (idTag) {
	let dateV = document.getElementById(idTag).innerHTML
	let finalDate = moment(dateV, "MMM Do YYYY").valueOf()
	return finalDate
}

let getMillisectoDate = function (myDate) {
	let datemillisec = (myDate * (1538517600000 - 951692400000)) / 100 + 951692400000
	let finalDate = new Date(datemillisec)
	finalDate = moment(finalDate).format("MMM Do YYYY");
	return [datemillisec, finalDate];
}

let updateGraphs=function(udl,startDateMillisec,endDateMillisec){
	getGraphPrice(udl, startDateMillisec,endDateMillisec)
	getGraphTotalVolume(udl, startDateMillisec,endDateMillisec)
	getGraphADV(udl, startDateMillisec, endDateMillisec)
}

let getGraphPrice = function (udl, startDate, endDate) {
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

			valuesData = valuesData.reverse()
			let dateRange = getDatesRange(valuesData, startDate, endDate)
			startDate = dateRange[0]
			endDate = dateRange[1]
			testdata = valuesData.filter(o => o[0] >= startDate && o[0] <= endDate)
			console.log('endDate dans Price', endDate)
			console.log('startDate dans Price', startDate)
			var config = graphConfig(6, `${udl} Price Evolution`, testdata)
			let secondchart = new Highcharts.stockChart('myChartPrice', config)

		})

}

let getGraphTotalVolume = function (udl, startDate, endDate) {
	// console.log("udl", udl)
	axios.get(`http://localhost:3000/api/totalvolume/${udl}`)
		.then(response => {
			// var result = _.sortBy(Object.values(response.data), o => o[0])
			// console.log(result)
			var result = Object.values(response.data)
			let dateRange = getDatesRange(result[0], startDate, endDate)
			startDate = dateRange[0]
			endDate = dateRange[1]
			resultRangeDates = result[0].filter(o => o[0] >= startDate && o[0] <= endDate)
			var config = graphConfig(6, `${udl} Total Volume Evolution`, resultRangeDates)
			let secondchart = new Highcharts.stockChart('myChartTotalVolume', config)
		})
}

let getGraphADV = function (udl, startDate, endDate) {
	axios.get(`http://localhost:3000/api/adv/${udl}`)
		.then(response => {
			// var result = _.sortBy(Object.values(response.data), o => o[0])
			// console.log(result)
			var result = Object.values(response.data)
			let dateRange = getDatesRange(result[0], startDate, endDate)
			startDate = dateRange[0]
			endDate = dateRange[1]

			resultRangeDates = result[0].filter(o => o[0] >= startDate && o[0] <= endDate)
			var config = graphConfig(6, `${udl} Average Daily Volume Evolution`, resultRangeDates)
			let secondchart = new Highcharts.stockChart('myChartADV', config)
		})
}

let getDescription = function (udl) {
	axios.get(`http://localhost:3000/api/udl/desc/${udl}`)
		.then(response => {
			// var result = _.sortBy(Object.values(response.data), o => o[0])
			// console.log(result)
			var result = Object.values(response.data)
			document.getElementById('udl-description').innerHTML = result[0]
		})
}

document.getElementById("lower").onchange = function (e) {
	let startDateMillisec = getMillisectoDate(e.target.value)[0]
	let startDate = getMillisectoDate(e.target.value)[1]
	document.getElementById("start-date").innerHTML = startDate;
	let udl = document.getElementById("udl-selected").value
	let endDateMillisec = getDatetoMillisec("end-date")
	updateGraphs(udl, startDateMillisec, endDateMillisec)
}

document.getElementById("upper").onchange = function (e) {
	let endDateMillisec = getMillisectoDate(e.target.value)[0]
	let endDate = getMillisectoDate(e.target.value)[1]
	document.getElementById("end-date").innerHTML = endDate;
	udl = document.getElementById("udl-selected").value
	let startDateMillisec = getDatetoMillisec("start-date")
	updateGraphs(udl, startDateMillisec, endDateMillisec)
}

document.getElementById("udl-selected").onchange = function (e) {
	udl = e.target.value;
	startDate = document.getElementById("start-date").innerHTML
	// console.log('startDate en udl-selected',startDate)
	endDate = document.getElementById("end-date").innerHTML
	// console.log('endDate en udl-selected',endDate)
	// console.log(udl)
	// window.location
	getDescription(udl)
	getGraphPrice(udl)
	getGraphTotalVolume(udl)
	getGraphADV(udl)
}