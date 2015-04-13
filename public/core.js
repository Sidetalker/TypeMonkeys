app = angular.module('typeMonkeys', ['timer'])

app.controller('MonkeyController', ['$scope', function(sc) {
	var alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m',
					'n','o','p','q','r','s','t','u','v','w','x','y','z']

	sc.letterCount = 0
	sc.letterQuantities = new Array(26)

	sc.timerRunning = true

	sc.startTimer = function() {
		console.log('Starting timer');
		sc.$broadcast('timer-start');
		sc.timerRunning = true;
	};

	sc.stopTimer = function() {
		console.log('Stopping timer')
		sc.$broadcast('timer-stop');
		sc.timerRunning = false;
	};

	sc.manualLetter = function(event) {
		if (event.charCode >= 97 && event.charCode <= 122) {
			console.log(alphabet[event.charCode - 97])
			sc.letterQuantities[event.charCode - 97]++
			sc.letterCount++
		}
	}

	sc.$on('timer-stopped', function(event, data) {
		console.log('Timer Stopped - data = ', data);
	});
}]);