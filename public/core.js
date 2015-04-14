// Initialize save variable
var saveData = {
	letterCount: 		0,
	letterDisplayState: 1,
	letterQuantities: 	[],
	achievements: 		[]
}

var achievements = []

// Load achievements from data file
$.ajax({
	url: 'includes/data/achievements.dat',
	type: 'get',
	async: true,

	success: function(data) {
		var split = data.split('\n')

		for (var i = 0; i < split.length; i++) 
			achievements.push(split[i].split('---'))

		console.log("Achievements loaded");

		console.log(achievements)
	}
});

app = angular.module('typeMonkeys', ['timer', 'ui.bootstrap', 'ipCookie'])

// Handles the segmented button controller for letter progress bar display
app.controller('TextToggleController', ['$scope', 'ipCookie', function(sc, ipCookie) {
	sc.radioModel = 'None';

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

	sc.updateTextDisplay = function(index) {
		console.log("Updating letter bar display state")

		saveData.letterDisplayState = index

		sc.$emit('updateTextDisplay', index);
	}
}])

var monkey = app.controller('MonkeyController', ['$scope', 'ipCookie', function(sc, ipCookie) {
	var alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m',
					'n','o','p','q','r','s','t','u','v','w','x','y','z']

	var cookie = ipCookie("saveData")

	// Load save data if found
	if (cookie) {
		console.log("Found save data!")

		saveData.letterCount = cookie.letterCount
		saveData.letterDisplayState = cookie.letterDisplayState
		saveData.letterQuantities = cookie.letterQuantities.slice(0,26)

		// Backward compatibility 

		// Check for achievements variable
		if (!cookie.achievements) {
			saveData.achievements = []

			for (var i = 0; i < achievements.length; i++) 
				saveData.achievements.push(false)

			ipCookie("saveData", saveData)

		}
		// Rectify achievement completion count in case new achievements have been added
		if (saveData.achievements.length != achievements.length) {
			saveData.achievements = []

			for (var i = saveData.achievements.length; i < achievements.length; i++) {
				saveData.achievements.push(false)
			}

			ipCookie("saveData", saveData)
		}

		ipCookie("saveData", saveData)

		console.log(cookie)

		console.log("Save data loaded!")
	}
	// Initialize empty save file if not found
	else {
		console.log("No save data found")

		saveData.letterCount = 0
		saveData.letterDisplayState = 0

		for (var i = 0; i < alphabet.length; i++) 
			saveData.letterQuantities.push(0)

		for (var i = 0; i < achievements.length; i++) 
			saveData.achievements.push(false)

		ipCookie("saveData", saveData)
	}

	sc.timerRunning = true

	// Assign scope variables to their corresponding cookie values
	sc.letterCount = saveData.letterCount
	sc.achievements = saveData.achievements

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

	var updateProgressBars = function() {
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

	// Create a progress bar for each letter of the alphabet
	// TODO: 
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

	// Set the programatically generated HTML and update the progress bars
	document.getElementById("progress").innerHTML = code
	updateProgressBars()

	sc.save = function() {
		ipCookie("saveData", saveData)

		console.log("Data saved")
		console.log(ipCookie("saveData"))
	}

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

	// Fired ever time the user presses a key 
	sc.manualLetter = function(event) {
		if (event.charCode >= 97 && event.charCode <= 122) {
			console.log("Keypress handled")

			saveData.letterQuantities[event.charCode - 97]++
			saveData.letterCount++
			sc.letterCount++

			updateProgressBars()
		}
	}

	// Events

	sc.$on('timer-stopped', function(event, data) {
		console.log('Timer stopped - data = ', data)
	})

	sc.$on('updateTextDisplay', function(event, index) {
		updateProgressBars()
	});
}])