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

let updateGraphs = function (udl, startDateMillisec, endDateMillisec) {
	getGraphPrice(udl, startDateMillisec, endDateMillisec)
	getGraphTotalVolume(udl, startDateMillisec, endDateMillisec)
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
	axios.get(`/api/totalvolume/${udl}`)
		.then(response => {
			// var result = _.sortBy(Object.values(response.data), o => o[0])
			// console.log(result)
			var result = Object.values(response.data)
			console.log('result details to use:', result)
			let dateRange = getDatesRange(result[0], startDate, endDate)
			startDate = dateRange[0]
			endDate = dateRange[1]
			resultRangeDates = result[0].filter(o => o[0] >= startDate && o[0] <= endDate)
			var config = graphConfig(6, `${udl} Total Volume Evolution`, resultRangeDates)
			let secondchart = new Highcharts.stockChart('myChartTotalVolume', config)
		})
}

let getGraphADV = function (udl, startDate, endDate) {
	axios.get(`/api/adv/${udl}`)
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
	axios.get(`/api/udl/desc/${udl}`)
		.then(response => {
			// var result = _.sortBy(Object.values(response.data), o => o[0])
			// console.log(result)
			var result = Object.values(response.data)
			document.getElementById('udl-description').innerHTML = result[0]
		})
}

let getDataTableVolume = function (udl) {
	axios.get(`/api/globalview/${udl}`)
		.then(response => {
			// var result = _.sortBy(Object.values(response.data), o => o[0])
			// console.log(result)
			var result = Object.values(response.data)
			let lentable = Object.keys(result[0]).length
			let keystable = Object.keys(result[0]).reverse()
			let valuestable = Object.values(result[0]).reverse()
			let volume_array = []
			for (i = 0; i < lentable; i++) {
				if (keystable[i] != "Symbol" & keystable[i] != "_id") {
					volume_array.push(valuestable[i]);
				}
			}
			let sum = volume_array.reduce(function (a, b) { return a + b; });
			let avg = sum / volume_array.length;
			$("#mytable-volume").html("")
			document.getElementById('mytable-volume').innerHTML += "<h2>GLOBAL VOLUME PER YEAR</h2>"
			document.getElementById('mytable-volume').innerHTML += "<table id='mytable-vol'></table>"
			let headertable = "";
			let bodytable = "";
			for (i = 0; i < lentable; i++) {
				if (keystable[i] != "_id") {
					headertable += `<th>${keystable[i]}</th>`
					if (keystable[i] != "Symbol") {
						if (valuestable[i] > avg) {
							bodytable += `<td class="active">${parseFloat(valuestable[i]).toLocaleString(undefined, { minimumFractionDigits: 0 })}</td>`
						} else {
							bodytable += `<td>${parseFloat(valuestable[i]).toLocaleString(undefined, { minimumFractionDigits: 0 })}</td>`

						}
					} else {
						bodytable += `<td>${valuestable[i]}</td>`
					}
				}
			}

			document.getElementById('mytable-vol').innerHTML += "<thead id='mytable-vol-head'>" + headertable + "</thead><tbody>" + bodytable + "</tbody>"
			$('#mytable-vol').DataTable();

		})
}

let getDataTableVolumeMonth = function (udl) {
	axios.get(`/api/volumemonth/${udl}`)
		.then(response => {
			// var result = _.sortBy(Object.values(response.data), o => o[0])
			// console.log(result)
			let result = Object.values(response.data)
			let valuestable = Object.values(result[0])
			let lentable = Object.keys(result[0]).length
			let volume_array = []
			for (i = 0; i < lentable; i++) {
				volume_array.push(valuestable[i][3])
			}
			let sum = volume_array.reduce(function (a, b) { return a + b; });
			let avg = sum / volume_array.length;
			console.log('values', valuestable)
			$("#mytable-volume-details").html("")
			// document.getElementById('mytable-volume').innerHTML = "";
			document.getElementById('mytable-volume-details').innerHTML += "<h2>VOLUME DETAILS</h2>"
			document.getElementById('mytable-volume-details').innerHTML += "<table id='mytable-vol-detail'></table>"
			document.getElementById('mytable-vol-detail').innerHTML += "<thead id='mytable-vol-det-head'><th>NAME</th><th>MONTH</th><th>YEAR</th><th>VOLUME</th></thead>"
			let bodytable = "";
			let bodydetails = "";
			for (i = 0; i < lentable; i++) {
				for (j = 0; j < 4; j++) {
					if (j == 3) {
						if (valuestable[i][j] >= avg) {
							bodydetails += `<td class="active">${parseFloat(valuestable[i][j]).toLocaleString(undefined, { minimumFractionDigits: 0 })}</td>`
						} else {
							bodydetails += `<td>${parseFloat(valuestable[i][j]).toLocaleString(undefined, { minimumFractionDigits: 0 })}</td>`
						}
					} else {
						bodydetails += `<td>${valuestable[i][j]}</td>`
					}
				}
				bodytable += `<tr>${bodydetails}</tr>`
				bodydetails = ""
			}
			document.getElementById('mytable-vol-detail').innerHTML += "<tbody>" + bodytable + "</tbody>"
			// document.getElementsByClassName('active').style.color="red"
			$('#mytable-vol-detail').DataTable();
		})
}

let getGraphDonutVolume = function (udl) {
	axios.get(`/api/globalview/${udl}`)
		.then(response => {
			// var result = _.sortBy(Object.values(response.data), o => o[0])
			// console.log(result)
			var result = Object.values(response.data)
			let lentable = Object.keys(result[0]).length
			let keystable = Object.keys(result[0]).reverse()
			let valuestable = Object.values(result[0]).reverse()
			let volume_array = []
			let label_array=[]
			for (i = 0; i < lentable; i++) {
				if (keystable[i] != "Symbol" & keystable[i] != "_id") {
					label_array.push(keystable[i])
					if (keystable[i]=="2014" || keystable[i]=="2017") {
						volume_array.push(valuestable[i]*12/2);
					}else {
						volume_array.push(valuestable[i]);
					}
					
				}
			}
			// let sum = volume_array.reduce(function (a, b) { return a + b; });
			// let avg = sum / volume_array.length;
			console.log('label_array',label_array)
			let array_colors=['rgb(177, 127, 38)', 'rgb(205, 152, 36)', 'rgb(99, 79, 37)', 'rgb(129, 180, 179)', 'rgb(124, 103, 37)']
			var data = [{
				values: volume_array,
				labels:label_array,
				marker: {
					colors: array_colors
				},
				domain: {column: 0},
				name: 'GLOBAL VOLUME PER YEAR',
				hoverinfo: 'label+percent',
				hole: .4,
				type: 'pie'
			}];

			var layout = {
				title: 'VOLUME REPARTITION',
				font: {color:'rgb(123, 113, 113)', style:"bold", size:"14"},
				grid: {rows: 1, columns: 1},
				showlegend: true,
				annotations: [{font: {size: "12"},showarrow: false,	text: 'VOLUME',x: 0.5,y: 0.5}
				],
				height: 400,
  	width: 500,
			};
			
			Plotly.newPlot('myChartDonut', data, layout);

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
	// startDate = document.getElementById("start-date").innerHTML
	// console.log('startDate en udl-selected',startDate)
	// endDate = document.getElementById("end-date").innerHTML

	let startDateMillisec = getDatetoMillisec("start-date")
	let endDateMillisec = getDatetoMillisec("end-date")
	getDescription(udl)
	updateGraphs(udl, startDateMillisec, endDateMillisec)
	// // getGraphPrice(udl)
	// getGraphTotalVolume(udl)
	// getGraphADV(udl)
	getDataTableVolume(udl)
	getDataTableVolumeMonth(udl)
	getGraphDonutVolume(udl)

}
