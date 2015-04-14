var saveData = {
	letterCount: 		0,
	letterDisplayState: 1,
	letterQuantities: 	[],
	letterPercents: 	[]
}

app = angular.module('typeMonkeys', ['timer', 'ui.bootstrap', 'ipCookie'])

app.controller('CollapseController', ['$scope', function (sc) {
	sc.isCollapsed = false
	sc.collapseText = "Hide Letter Breakdown"

	sc.toggle = function() {
		sc.isCollapsed = !sc.isCollapsed
		sc.collapseText = sc.isCollapsed ? "Show Letter Breakdown" : "Hide Letter Breakdown"
	}
}])

app.controller('TextToggleController', ['$scope', 'ipCookie', function(sc, ipCookie) {
	sc.radioModel = 'None';

	console.log(ipCookie("saveData"))

	if (ipCookie("saveData")) {
		switch (ipCookie("saveData").letterDisplayState) {
			case 0: 
				sc.radioModel = 'None'
				break;
			case 1: 
				sc.radioModel = 'Letter'
				break;
			case 2: 
				sc.radioModel = 'Count'
				break;
			case 3: 
				sc.radioModel = 'Both'
				break;
		}
	}

	sc.update = function(index) {
		console.log("Updating letter bar display state")

		saveData.letterDisplayState = index

		sc.$emit('update', index);
	}
}])

var monkey = app.controller('MonkeyController', ['$scope', 'ipCookie', function(sc, ipCookie) {
	var alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m',
					'n','o','p','q','r','s','t','u','v','w','x','y','z']

	sc.timerRunning = true
	sc.letterCount = 0

	if (ipCookie("saveData")) {
		console.log("Found save data!")

		var cookie = ipCookie("saveData")
		console.log(cookie)

		saveData.letterCount = cookie.letterCount
		sc.letterCount = cookie.letterCount
		saveData.letterDisplayState = cookie.letterDisplayState
		saveData.letterQuantities = cookie.letterQuantities
		saveData.letterPercents = cookie.letterPercents

		console.log("Save data loaded!")
	}
	else {
		console.log("No save data found")
	}

	for (var i = 0; i < alphabet.length; i++) {
		saveData.letterQuantities.push(0)
	}

	console.log('Generating alphabet progress bars')

	var code = ""
	var max = 0

	for (var i = 0; i < alphabet.length; i++) {
		if (saveData.letterQuantities[i] > max) {
			max = saveData.letterQuantities[i]
		}
	}

	var getProgressBarData = function(index, max) {
		var cur = saveData.letterQuantities[index]
		var myClass = "progress-bar progress-bar-info ease-in-out"
		var myText = '<b>' + alphabet[index].toUpperCase() + '</b>'
		var myValue = saveData.letterQuantities[index] / max * 100 + "%"

		if (cur >= max * 0.7) {
			myClass = "progress-bar progress-bar-success ease-in"
		}
		else if (cur >= max * 0.4) {
			myClass = "progress-bar progress-bar-warning ease-in"
		}
		else {
			myClass = "progress-bar progress-bar-danger ease-in"
		}

		switch(saveData.letterDisplayState) {
			case 0:
				myText = ""
				break;
			case 1:
				myText = '<b>' + alphabet[index].toUpperCase() + '</b>'
				break;
			case 2:
				myText = '<b>' + cur + '</b>'
				break;
			case 3:
				myText = '<b>' + alphabet[index].toUpperCase() + ' (' + cur + ')</b>'
		}

		if (saveData.letterQuantities[index] == 0) {
			myText = ""
		}

		var myID = "progressBar" + index

		return [myID, myClass, myText, myValue]
	}

	for (var i = 0; i < alphabet.length; i++) {
		if (i + 2 < alphabet.length) {
			code += '<div class="row">\n'
        	code += '	<div class="col-md-4">\n'
			code += '		<div class="progress">\n'
			code += '			<div id="progressBar' + i + '" class="progress-bar progress-bar-info ease-in" aria-valuetransitiongoal="0">'
        	code += '				<span ><b><div id="progressBarLabel' + i + '"></div></b></span>\n'
        	code += '			</div>\n'
      		code += '		</div>\n'
      		code += '	</div>'
      		i++
        	code += '	<div class="col-md-4">\n'
			code += '		<div class="progress">\n'
			code += '			<div id="progressBar' + i + '" class="progress-bar progress-bar-info ease-in" aria-valuetransitiongoal="0">'
        	code += '				<span ><b><div id="progressBarLabel' + i + '"></div></b></span>\n'
        	code += '			</div>\n'
      		code += '		</div>\n'
      		code += '	</div>'
      		i++
        	code += '	<div class="col-md-4">\n'
			code += '		<div class="progress">\n'
			code += '			<div id="progressBar' + i + '" class="progress-bar progress-bar-info ease-in" aria-valuetransitiongoal="0">'
        	code += '				<span ><b><div id="progressBarLabel' + i + '"></div></b></span>\n'
        	code += '			</div>\n'
      		code += '		</div>\n'
      		code += '	</div>'
      		code += '</div>'
		}
		else {
			code += '<div class="row">\n'
        	code += '	<div class="col-md-6">\n'
			code += '		<div class="progress">\n'
			code += '			<div id="progressBar' + i + '" class="progress-bar progress-bar-info ease-in" aria-valuetransitiongoal="0">'
        	code += '				<span ><b><div id="progressBarLabel' + i + '"></div></b></span>\n'
        	code += '			</div>\n'
      		code += '		</div>\n'
      		code += '	</div>'
      		i++
        	code += '	<div class="col-md-6">\n'
			code += '		<div class="progress">\n'
			code += '			<div id="progressBar' + i + '" class="progress-bar progress-bar-info ease-in" aria-valuetransitiongoal="0">'
        	code += '				<span ><b><div id="progressBarLabel' + i + '"></div></b></span>\n'
        	code += '			</div>\n'
      		code += '		</div>\n'
      		code += '	</div>'
      		code += '</div>'
		}
	}

	document.getElementById("progress").innerHTML = code

	var updateProgressBars = function() {
		console.log('Updating letter bars')

		var max = 0

		for (var i = 0; i < alphabet.length; i++) {
			if (saveData.letterQuantities[i] > max) {
				max = saveData.letterQuantities[i]
			}
		}

		for (var i = 0; i < alphabet.length; i++) {
			var data = getProgressBarData(i, max)

			document.getElementById("progressBar" + i).className = data[1]
			document.getElementById("progressBar" + i).style.width = data[3]
			document.getElementById("progressBarLabel" + i).innerHTML = data[2]
		}
	}

	updateProgressBars()

	sc.save = function() {
		ipCookie("saveData", saveData)
	}

	sc.$on('update', function(event, index) {
		updateProgressBars()
	});

	sc.startTimer = function() {
		console.log('Starting timer')
		sc.$broadcast('timer-start')
		sc.timerRunning = true
	}

	sc.stopTimer = function() {
		console.log('Stopping timer')
		sc.$broadcast('timer-stop')
		sc.timerRunning = false
	}

	sc.manualLetter = function(event) {
		if (event.charCode >= 97 && event.charCode <= 122) {
			saveData.letterQuantities[event.charCode - 97]++
			saveData.letterCount++
			sc.letterCount++

			updateProgressBars()
		}
	}

	sc.$on('timer-stopped', function(event, data) {
		console.log('Timer Stopped - data = ', data)
	})
}])