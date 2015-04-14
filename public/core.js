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

		for (var i = 0; i < split.length; i++)  {
			if (split[i].replace(/(\r\n|\n|\r)/gm,"") == "") { continue }

			achievements.push(split[i].split('---'))
		}

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

var monkey = app.controller('MonkeyController', ['$scope', 'ipCookie', function(sc, ipCookie, $compile) {
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
	sc.achievements = achievements
	sc.achievementCount = achievements.length

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

	// Generate the achievements HTML
	for (var i = 0; i < achievements.length; i++) {

		var remaining = achievements.length - i <= 4 ? achievements.length - i : 4

		code += '<div class="row">'

		for (var y = 0; y < remaining; y++) {
			code += 	'<div class="col-md-3"> \
							<div id="achievementPanel' + i + '" class="panel panel-danger"> \
								<div class="panel-heading"> \
									<div id="achievementHeading" index="' + i + '" class="panel-title">' + achievements[i][0] + '<span class="badge pull-right">10 pts</span></div> \
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

	// Set the programatically generated HTML 
	achievementsElement = document.getElementById("achievementPlaceholder")
	achievementsElement.innerHTML = code

	// Update completions
	for (var i = 0; i < achievements.length; i++) {
		if (saveData.achievements[i]) {
			var panel = document.getElementById("achievementPanel" + i)

			if (panel) { panel.className = "panel panel-success" }
		}

	}

	console.log(achievements[0][0])

	var updateAchievements = function() {
		return null
	}

	updateAchievements()

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

// Directive playground - shit aint bein used

// Example HTML: <div id="unicTab" index="2" unic-tab-content></div>
// app.directive("unicTabContent", function() {
// 	var linkFunction = function(scope, element, attributes) {
// 		console.log(attributes)
// 	};

//    return {
//       restrict:"A",
//       template:'Tesing!',
//       link: linkFunction
//    }
// })

// app.directive("achievementHeading", function($compile, $parse) {
// 	var index = 0

// 	var linkFunction = function(scope, element, attributes) {
// 		console.log(scope)
// 		scope.index = parseInt(attributes.index)
// 		index = scope.index

// 		scope.$watch(attributes.content, function() {
// 			element.html($parse(attributes.content)(scope));
// 			$compile(element.contents())(scope);
//         }, true);
// 	};

//    return {
//       restrict:"A",
//       template:"{{ achievements[" + index + "][0]}}",
//       link: linkFunction
//    }
// })

// app.directive("achievementBody", function() {
// 	var index = 0

// 	var linkFunction = function($scope, element, attributes) {
// 		scope.index = parseInt(attributes.index)
// 		index = scope.index
// 	};

//    return {
//       restrict:"A",
//       template:"{{ achievements[" + index + "][1]}}",
//       link: linkFunction
//    }
// })