var myChart =null;

(function(){
	var app = angular.module('conditioner', ['ngStorage', 'firebase']);
	app.controller('ConditionerController', function($scope, $localStorage, $firebaseArray, $firebase) {
		$scope.radioT = 'C';
		$scope.inform = {};
		$scope.informs = [];
		var temperature = {};
		var l = 0;
		var ref = new Firebase("https://fbapp-4aacc.firebaseio.com/conditioner");

		$scope.messages = $firebaseArray(ref);

		$scope.$watch('messages.length', function(newValue, oldValue) {
		
			  if(newValue < oldValue){
			  	//location.reload();
			  }
		});
		
		
		$scope.addToTable = function(minTempr, maxTempr, radioT, setTempr, dateFrom, dateTo ) {
			$('#temprForm').validate().form();
			
			$scope.inform = {
				from: document.getElementById('dateFrom').value,
				to:  document.getElementById('dateTo').value,
				min: +document.getElementById('minT').value,
				max: +document.getElementById('maxT').value,
				radio: radioT,
				set: +document.getElementById('setT').value,
				
			}
			
			if(minTempr == undefined || maxTempr == undefined || setTempr == undefined || dateFrom == undefined || dateTo == undefined) {
				return false;
			} else {
				//console.log($scope.messages.length)
				$scope.messages.$add($scope.inform);
				$scope.informs = $scope.messages;
				

				
			}
	
		};
		ref.limitToLast(1).on('child_added', function(snapshot) {
			$scope.redrawCh(snapshot.val())
		});
		ref.on('child_removed', function(snapshot) {
			location.reload();
			
		});

		
		$scope.deleteRow = function(event){

			event = event || window.event;
			event.preventDefault();
			
			var item = $scope.messages[this.$index];
			myChart.series[this.$index].remove()
			$scope.messages.$remove(item).then(function(ref) {
			  ref.key() === item.$id; // true
			  

			});

		}

		$scope.loadStorage = function() {
			
			$scope.informs = $scope.messages;
			$scope.messages.$loaded().then(function(x) {
			$scope.storage = $scope.messages;
			var arr = [];
		   	for(var key in $scope.storage) {
		   		if(typeof ($scope.storage[key]) =='object' ){
		   			arr.push($scope.storage[key])
		   			
		   		}

			}

			for(var i = 0; i < arr.length-1;i++){
				$scope.redrawCh(arr[i]);	
			}
				return $scope.storage;
		  })
		  .catch(function(error) {
		    console.log("Error:", error);
		  });

		};

		
		$scope.redrawCh = function(msg) {
			
			var chartMsg = {};
			var msF = Date.parse(msg.from) +15000000;
			var msT = Date.parse(msg.to)  +15000000;

			var dayFrom = moment(msF);
			var dayTo = moment(msT);
			var diff = dayTo.diff(dayFrom,'days');

			chartMsg = {
				"min" : [],
				"max" : [],
				"set" : []
			}
			for(var i = 0; i <= diff; i++) {
				  	
				chartMsg.max.push([dayFrom.valueOf(), msg.max]);
			    chartMsg.min.push([dayFrom.valueOf(), msg.min]);
			    chartMsg.set.push([dayFrom.valueOf(), msg.set]);
				dayFrom.add(1,'day');    
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