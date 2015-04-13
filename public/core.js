var letterDisplayIndex = 1
var maxLetterCount = 0	

		$(window).ready(function(e){
      $.each($('div.progress-bar'),function(){
        $(this).css('width', $(this).attr('aria-valuetransitiongoal')+'%');
      });
});

app = angular.module('typeMonkeys', ['timer', 'ui.bootstrap'])

app.controller('ProgressDemoCtrl', function ($scope) {
  $scope.max = 200;

  $scope.update = function() {
  	console.log('asdasf')
  }

  $scope.random = function() {
    var value = Math.floor((Math.random() * 100) + 1);
    var type;

    if (value < 25) {
      type = 'success';
    } else if (value < 50) {
      type = 'info';
    } else if (value < 75) {
      type = 'warning';
    } else {
      type = 'danger';
    }

    $scope.showWarning = (type === 'danger' || type === 'warning');

    $scope.dynamic = value;
    $scope.type = type;
  };
  $scope.random();

  $scope.randomStacked = function() {
    $scope.stacked = [];
    var types = ['success', 'info', 'warning', 'danger'];

    for (var i = 0, n = Math.floor((Math.random() * 4) + 1); i < n; i++) {
        var index = Math.floor((Math.random() * 4));
        $scope.stacked.push({
          value: Math.floor((Math.random() * 30) + 1),
          type: types[index]
        });
    }
  };
  $scope.randomStacked();
});

app.controller('CollapseController', ['$scope', function (sc) {
	sc.isCollapsed = false
	sc.collapseText = "Hide Letter Breakdown"

	sc.toggle = function() {
		sc.isCollapsed = !sc.isCollapsed
		sc.collapseText = sc.isCollapsed ? "Show Letter Breakdown" : "Hide Letter Breakdown"
	}
}])

var monkey = app.controller('MonkeyController', ['$scope', function(sc) {
	var alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m',
					'n','o','p','q','r','s','t','u','v','w','x','y','z']

	sc.letterCount = 0
	sc.letterQuantities = []

	for (var i = 0; i < alphabet.length; i++) {
		sc.letterQuantities.push(0)
	}

	sc.timerRunning = true

	var getProgressBarData = function(index, max) {
		var cur = sc.letterQuantities[index]
		var type = "progress-bar progress-bar-info active"
		var text = ""

		if (cur >= max * 0.7) {
			type = "progress-bar progress-bar-success active six-sec-ease-in-out"
		}
		else if (cur >= max * 0.4) {
			type = "progress-bar progress-bar-warning active"
		}
		else {
			type = "progress-bar progress-bar-danger active"
		}

		if (cur > 0) {
			text = alphabet[index].toUpperCase()
		}

		return [type, text, sc.letterQuantities[index]]
	}

	var updateProgressBars = function() {
		console.log('Updating progress bars')

		var code = ""
		var max = 0

		for (var i = 0; i < alphabet.length; i++) {
			if (sc.letterQuantities[i] > max) {
				max = sc.letterQuantities[i]
			}
		}

		maxLetterCount = max

		for (var i = 0; i < alphabet.length; i+=3) {
			if (i + 2 < alphabet.length) {
				var data1 = getProgressBarData(i, max)
				var data2 = getProgressBarData(i + 1, max)
				var data3 = getProgressBarData(i + 2, max)

				code += '<div class="row">\n'
	        	code += '	<div class="col-md-4">\n'
				code += '		<div class="progress">\n'
				code += '			<div class="' + data1[0] + '" role="progressbar" aria-valuenow="' + data1[2] + '" aria-valuemin="0" aria-valuemax="' + max + '" style="width: ' + (data1[2] / max * 100) + '%">\n'
	        	code += '				<span ><b>' + data1[1] + '</b></span>\n'
	        	code += '			</div>\n'
	      		code += '		</div>\n'
	      		code += '	</div>'
	        	code += '	<div class="col-md-4">\n'
				code += '		<div class="progress">\n'
				code += '			<div class="' + data2[0] + '" role="progressbar" aria-valuenow="' + data2[2] + '" aria-valuemin="0" aria-valuemax="' + max + '" style="width: ' + (data2[2] / max * 100) + '%">\n'
	        	code += '				<span ><b>' + data2[1] + '</b></span>\n'
	        	code += '			</div>\n'
	      		code += '		</div>\n'
	      		code += '	</div>'
	        	code += '	<div class="col-md-4">\n'
				code += '		<div class="progress">\n'
				code += '			<div class="' + data3[0] + '" role="progressbar" aria-valuenow="' + data3[2] + '" aria-valuemin="0" aria-valuemax="' + max + '" style="width: ' + (data3[2] / max * 100) + '%">\n'
	        	code += '				<span ><b>' + data3[1] + '</b></span>\n'
	        	code += '			</div>\n'
	      		code += '		</div>\n'
	      		code += '	</div>'
	      		code += '</div>'
			}
			else {
				var data1 = getProgressBarData(i, max)
				var data2 = getProgressBarData(i + 1, max)

				code += '<div class="row">\n'
	        	code += '	<div class="col-md-6">\n'
				code += '		<div class="progress">\n'
				code += '			<div class="progress-bar six-sec-ease-in-out" aria-valuetransitiongoal="20">\n'
				// code += '			<div class="' + data1[0] + '" aria-valuenow="' + data1[2] + '" aria-valuemin="0" aria-valuemax="' + max + '" style="width: ' + (data1[2] / max * 100) + '%">\n'
	        	code += '				<span ><b>' + data1[1] + '</b></span>\n'
	        	code += '			</div>\n'
	      		code += '		</div>\n'
	      		code += '	</div>'
	        	code += '	<div class="col-md-6">\n'
				code += '		<div class="progress">\n'
				code += '			<div class="' + data2[0] + '" role="progressbar" aria-valuenow="' + data2[2] + '" aria-valuemin="0" aria-valuemax="' + max + '" style="width: ' + (data2[2] / max * 100) + '%">\n'
	        	code += '				<span ><b>' + data2[1] + '</b></span>\n'
	        	code += '			</div>\n'
	      		code += '		</div>\n'
	      		code += '	</div>'
	      		code += '</div>'
			}




			// else {
			// 	var data1 = getProgressBarData(i, max)
			// 	var data2 = getProgressBarData(i + 1, max)

			// 	code += '<div class="row">\n'
	  //       	code += '	<div class="col-md-6">\n'
			// 	code += '		<div class="progress">\n'
			// 	code += '			<div class="' + data1[0] + '" aria-valuenow="' + data1[2] + '" aria-valuemin="0" aria-valuemax="' + max + '" style="width: ' + (data1[2] / max * 100) + '%">\n'
	  //       	code += '				<span ><b>' + data1[1] + '</b></span>\n'
	  //       	code += '			</div>\n'
	  //     		code += '		</div>\n'
	  //     		code += '	</div>'
	  //       	code += '	<div class="col-md-6">\n'
			// 	code += '		<div class="progress">\n'
			// 	code += '			<div class="' + data2[0] + '" role="progressbar" aria-valuenow="' + data2[2] + '" aria-valuemin="0" aria-valuemax="' + max + '" style="width: ' + (data2[2] / max * 100) + '%">\n'
	  //       	code += '				<span ><b>' + data2[1] + '</b></span>\n'
	  //       	code += '			</div>\n'
	  //     		code += '		</div>\n'
	  //     		code += '	</div>'
	  //     		code += '</div>'
			// }
		}

		document.getElementById("progress").innerHTML = code
	}

	updateProgressBars()

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

app.controller('TextToggleController', ['$scope', function(sc) {
	sc.singleModel = 1

	sc.radioModel = 'Letter';

	sc.checkModel = {
		none: false,
		letter: true,
		count: false,
		percent: false
	}

	sc.update = function(index) {
		letterDisplayIndex = index

		sc.$emit('update', index);
	}
}])