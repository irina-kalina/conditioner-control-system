var myChart =null;

(function(){
	var app = angular.module('conditioner', ['ngStorage']);
	app.controller('ConditionerController', function($scope, $localStorage) {
		$scope.radioT = 'C';
		$scope.inform = {};
		$scope.informs = [];
		var temperature = {};

		$scope.addToTable = function(minTempr, maxTempr, radioT, setTempr, dateFrom, dateTo ) {
			$('#temprForm').validate().form();
			
			$scope.inform = {
				from: dateFrom,
				to: dateTo,
				min: +document.getElementById('minT').value,
				max: +document.getElementById('maxT').value,
				radio: radioT,
				set: +document.getElementById('setT').value,
				
			}
			
			if(minTempr == undefined || maxTempr == undefined || setTempr == undefined || dateFrom == undefined || dateTo == undefined) {
				return false;
			} else {
				
				$scope.informs.push($scope.inform);

				var df = document.getElementById('dateFrom').value;
				var dt = document.getElementById('dateTo').value;
				var msF = Date.parse(df);
				var msT = Date.parse(dt);
				var dayFrom = moment(msF);
				var dayTo = moment(msT);
				var diff = dayTo.diff(dayFrom,'days');
				var min = +$('#minT').val();
				var max = +$('#maxT').val();
			    var setTempr = +$('#setT').val();

				temperature = {
					"min" : [],
					"max" : [],
					"setTempr" : []
				};
				    
				for(var i = 0; i <= diff; i++) {
				    dayFrom.add(1,'day');
				   	temperature.max.push([dayFrom.valueOf(), max]);
				    temperature.min.push([dayFrom.valueOf(), min]);
				    temperature.setTempr.push([dayFrom.valueOf(), setTempr]);
					 
				}

				myChart.addSeries({
				    name: 'min',
				    data: temperature.min
				}, false);

			    myChart.addSeries({
				    name: 'max',
				    data: temperature.max
				}, false);

				myChart.addSeries({
				    name: 'set',
				    data: temperature.setTempr
				}, false);

				myChart.redraw();

				function isLocalStorageAvailable() {
				    try {
					        return 'localStorage' in window && window['localStorage'] !== null;
					    } catch (e) {
						    return false;
					    }
				}

				localStorage.setItem('tableData', JSON.stringify($scope.informs));

			}

		};

		var socket = io.connect('http://localhost:8008');

		$('form').submit(function() {
       		socket.emit('message', $scope.inform);

      	});

      	socket.on('message', function(msg) {

		  	$scope.informs.push(msg);
		  	location.reload();   
			
		});

		$scope.redrawCh = function(msg) {

			var chartMsg = {};
			var msF = Date.parse(msg.from);
			var msT = Date.parse(msg.to);
			var dayFrom = moment(msF);
			var dayTo = moment(msT);
			var diff = dayTo.diff(dayFrom,'days');

			chartMsg = {
				"min" : [],
				"max" : [],
				"set" : []
			}
			for(var i = 0; i <= diff; i++) {
				dayFrom.add(1,'day');   	
				chartMsg.max.push([dayFrom.valueOf(), msg.max]);
			    chartMsg.min.push([dayFrom.valueOf(), msg.min]);
			    chartMsg.set.push([dayFrom.valueOf(), msg.set]);
				    
			}

			myChart.addSeries({
			    name: 'min',
			    data: chartMsg.min
			}, false);

			myChart.addSeries({
			    name: 'max',
			    data: chartMsg.max
			}, false);

			myChart.addSeries({
			    name: 'set',
			    data: chartMsg.set
			}, false);

			myChart.redraw();
 
		};

		$scope.loadStorage = function() {
			
			$scope.storage = JSON.parse(localStorage.getItem('tableData')) || [];
			$scope.informs = $scope.informs.concat($scope.storage);

			for(var key in $scope.informs) {
				$scope.redrawCh($scope.informs[key]);
			}
			return $scope.storage;
		
		};

		myChart = Highcharts.chart('container', {
		           
		    title: {
		        text: 'Temperature Chart'
		   },
		           
		    xAxis: {
		         type: 'datetime'
		    },

		    yAxis: {
		        allowDecimals: false,
		        title: {
		             text: 'Temperature'
		        }
		    },

		    series: []

		});

	});
	
})();