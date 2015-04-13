app = angular.module('typeMonkeys', ['timer'])

app.controller('MonkeyController', ['$scope', function(sc) {
	var alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m',
					'n','o','p','q','r','s','t','u','v','w','x','y','z']

	sc.letterCount = 0
	sc.letterQuantities = []

	for (var i = 0; i < alphabet.length; i++) {
		sc.letterQuantities.push(0)
	}

	sc.timerRunning = true

	var updateProgressBars = function() {
		var code = ""
		var max = 0

		for (var i = 0; i < alphabet.length; i++) {
			if (sc.letterQuantities[i] > max) {
				max = sc.letterQuantities[i]
			}
		}

		console.log(max)

		for (var i = 0; i < alphabet.length; i++) {
			var cur = sc.letterQuantities[i]
			var type = "progress-bar progress-bar-info"
			var text = ""

			if (cur >= max * 0.7) {
				type = "progress-bar progress-bar-success"
			}
			else if (cur >= max * 0.4) {
				type = "progress-bar progress-bar-warning"
			}
			else {
				type = "progress-bar progress-bar-danger"
			}

			if (cur > 0) {
				text = alphabet[i] + '</b> (' + cur + ')'
			}

			code += '\t\t<div class="progress">\n'
			code += '\t\t\t<div class="' + type + '" role="progressbar" aria-valuenow="' + cur + '" aria-valuemin="0" aria-valuemax="' + max + '" style="width: ' + (cur / max * 100) + '%">\n'
        	code += '\t\t\t\t<span ><b>' + text + '</span>\n'
        	code += '\t\t\t</div>'
      		code += '\t\t</div>'
		}

		document.getElementById("progress").innerHTML = code
	}

	updateProgressBars()

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
			console.log(alphabet[event.charCode - 97])
			sc.letterQuantities[event.charCode - 97]++
			sc.letterCount++

			updateProgressBars()
		}
	}

	sc.$on('timer-stopped', function(event, data) {
		console.log('Timer Stopped - data = ', data)
	})
}])