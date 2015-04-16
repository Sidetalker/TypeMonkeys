// Initialize save variable
var saveData = {
	letterCount: 		0,
	letterDisplayState: 1,
	letterQuantities: 	[],
	letterLog:  		[],
	achievements: 		[]
}

var achievements = []

var identical = function(array) {
    for(var i = 0; i < array.length - 1; i++) {
        if(array[i] != array[i+1]) {
            return false;
        }
    }

    return true;
}

app = angular.module('typeMonkeys', ['timer', 'ui.bootstrap', 'ipCookie'])

// Takes care of retrieving the achievements data when the app is loaded
app.factory('firstLoad', function($http) { 
    return $http.get('/includes/data/achievements.dat');
});

// Main Controller - should probably be broken up into some factories, eh, idk
app.controller('MonkeyController', ['$scope', 'ipCookie', 'firstLoad', function(sc, ipCookie, firstLoad) {
	sc.timerRunning = true

	var alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m',
					'n','o','p','q','r','s','t','u','v','w','x','y','z']

	var cookie = ipCookie("saveData")

	// Hide alerts
	$("#achievement-alert").hide();

	sc.currentAchievement = ""
	sc.currentDescription = ""
	sc.currentPoints = 0

	var updateAchievements = function(firstRun) {
		var newbies = []

		// [0] No monkeyin' around---Have the same number of each letter---5
		if (!saveData.achievements[0]) {
			if (identical(saveData.letterQuantities) && saveData.letterQuantities[0] >= 1) {
				saveData.achievements[0] = true
				newbies.push(achievements[0])
			}
		}

		// [1] Happy Birthday!---Refresh the page at 11:11---5
		if (!saveData.achievements[1] && firstRun) {
			var date = new Date()

			if (date.getHours() == 11 && date.getMinutes() == 11) {
				saveData.achievements[1] = true
				newbies.push(achievements[1])
			}
		}

		// Update UI
		for (var i = 0; i < saveData.achievements.length; i++) {
			if (saveData.achievements[i]) {
				var panel = document.getElementById("achievementPanel" + i)

				if (panel) { panel.className = "panel panel-success" }
			}
			else {
				var panel = document.getElementById("achievementPanel" + i)

				if (panel) { panel.className = "panel panel-danger" }
			}
		}

		// Pop bannerz
		if (!firstRun) {		
			for (var i = 0; i < newbies.length; i++) {
				sc.currentAchievement = newbies[i][0]
				sc.currentDescription = newbies[i][1]
				sc.currentPoints = newbies[i][2]

				$("#achievement-alert").slideDown(500)
				$("#achievement-alert").fadeTo(5000, 500).slideUp(500, function(){
					$("#achievement-alert").alert('close');
				});
			}
		}
	}

	firstLoad.success(function(data) {
		// Load achievements from file
		var split = data.split('\n')

		for (var i = 0; i < split.length; i++)  {
			if (split[i].replace(/(\r\n|\n|\r)/gm,"") == "") { continue }

			achievements.push(split[i].split('---'))
		}

		console.log("Achievements loaded");

		console.log(achievements)

		// Load save data if found
		if (cookie) {
			console.log("Found save data!")

			saveData.letterCount = cookie.letterCount
			saveData.letterDisplayState = cookie.letterDisplayState
			saveData.letterQuantities = cookie.letterQuantities.slice(0,26)

			if (cookie.letterLog) {
				saveData.letterLog = cookie.letterLog.slice(0,50)
			}

			// Check for achievements variable
			if (!cookie.achievements) {
				saveData.achievements = []

				for (var i = 0; i < achievements.length; i++) 
					saveData.achievements.push(false)

				ipCookie("saveData", saveData)
			}
			else {
				saveData.achievements = cookie.achievements
			}

			// Rectify achievement completion count in case new achievements have been added
			if (saveData.achievements.length != achievements.length) {
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
			saveData.letterQuantities = []
			saveData.achievements = []

			for (var i = 0; i < alphabet.length; i++) 
				saveData.letterQuantities.push(1000)

			for (var i = 0; i < achievements.length; i++) 
				saveData.achievements.push(false)

			ipCookie("saveData", saveData)

			updateAchievements(true)
		}

		// Generate Achievements HTML
		for (var i = 0; i < achievements.length; i++) {

			var remaining = achievements.length - i <= 4 ? achievements.length - i : 4

			code += '<div class="row">'

			for (var y = 0; y < remaining; y++) {
				code += 	'<div class="col-md-3"> \
								<div id="achievementPanel' + i + '" class="panel panel-danger"> \
									<div class="panel-heading"> \
										<div id="achievementHeading" index="' + i + '" class="panel-title">' + achievements[i][0] + '<span class="badge pull-right">' + achievements[i][2] + ' pts</span></div> \
									</div> \
									<div class="panel-body"> \
										<div id="achievementBody" index="' + i + '" class="panel-text">' + achievements[i][1] + '</div> \
									</div> \
								</div> \
							</div>'
				i++
			}

			code += '</div>'

			i--
		}

		// Set the programatically generated code 
		achievementsElement = document.getElementById("achievementPlaceholder")
		achievementsElement.innerHTML = code

		updateAchievements(true)

		// Assign scope variables to their corresponding cookie values
		sc.letterCount = 0

		$.each(saveData.letterQuantities, function() {
			sc.letterCount += this;
		});

		sc.achievements = achievements

		sc.$emit('updateTextDisplay', 0);
	});

	console.log('Generating alphabet progress bars')

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

	var code = ""

	// Create a progress bar for each letter of the alphabet
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
	code = ""

	updateAchievements(false)

	sc.pointCount = function() {
		var count = 0

		for (var i = 0; i < achievements.length; i++) {
			if (saveData.achievements[i]) {
				count += parseInt(achievements[i][2])
			}
		}

		return count
	}

	sc.letterLog = function() {
		return saveData.letterLog.join(" ")
	}

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

			if (saveData.letterLog.length == 50) 
				saveData.letterLog = saveData.letterLog.slice(1,50)

			saveData.letterLog.push(alphabet[event.charCode - 97])

			updateProgressBars()
			updateAchievements(false)
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