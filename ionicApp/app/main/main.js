'use strict';
angular.module('main', [
  'ionic',
  'ngCordova',
  'ui.router',
  'firebase',
  // TODO: load other modules selected during generation
])
.config(function ($stateProvider, $urlRouterProvider) {

  // ROUTING with ui.router
  $urlRouterProvider.otherwise('/main');
  $stateProvider
    // this state is placed in the <ion-nav-view> in the index.html
    .state('main', {
      url: '/main',
      //template: '<ion-view view-title="main"><div style="height:100px;">q</div><h1>zzzzz</h1></ion-view>',
      templateUrl: 'main/templates/mainView.html',
      // controller: 'SomeCtrl as ctrl'
    });
})
.controller('myAppCtrl', function ($scope, $firebase, $firebaseArray) {
  $scope.radioT = 'C';
    $scope.inform = {};
    $scope.informs = [];
    var temperature = {};
    var l = 0;
    var ref = new Firebase("https://fbapp-4aacc.firebaseio.com/conditioner");

    $scope.messages = $firebaseArray(ref);

    /*$scope.$watch('messages.length', function(newValue, oldValue) {
    
        if(newValue < oldValue){
          location.reload();
        }
    });*/
    
    
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
        

        /*var df = document.getElementById('dateFrom').value;
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
           
            temperature.max.push([dayFrom.valueOf(), max]);
            temperature.min.push([dayFrom.valueOf(), min]);
            temperature.setTempr.push([dayFrom.valueOf(), setTempr]);
          dayFrom.add(1,'day');
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

        //myChart.redraw(); */
        
      }
  
    };
    ref.limitToLast(1).on('child_added', function(snapshot) {
      $scope.redrawCh(snapshot.val())
    });
    ref.on('child_removed', function(snapshot) {
      location.reload();
      //myChart.series[0].remove()
    });

    $scope.deleteRow = function(event){
      event = event || window.event;
      event.preventDefault();
      
      var item = $scope.messages[this.$index];

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
      var msT = Date.parse(msg.to) +15000000;
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


  $(document).ready(function() {
          $('#temprForm').validate({
              highlight: function(element, errorClass) {
                  $(element).addClass("invalidElem");
                  $(element).parent().css("height", "55px");
              },
              unhighlight: function(element, errorClass) {
                  $(element).removeClass("invalidElem");
                  $(element).parent().css("height", "35px");
              },
              errorElement:"div",
              errorClass: "errorMsg"

          }); 

          var calendarBtn = $(".ui-datepicker-trigger").wrap("<div class='wrapBut '></div>");
         
          $.validator.addMethod('pattern', function (value, elem) {
              var pattern = new RegExp($(elem).attr("pattern"));
              return pattern.test(value);
          }, '');

          $.validator.addMethod('min', function (value, elem) {

              var checkElem = ($(elem).attr("min") ? $($(elem).attr("min")) : null);
              if (checkElem)  {
                  var min = checkElem.val();    
                  
                  if( min > value){
                      return false;
                  }
              }     
                  return true;

          }, '');

          $.validator.addMethod('max', function (value, elem) {

              var checkElem = ($(elem).attr("max") ? $($(elem).attr("max")) : null);
              if (checkElem)  {
                  var max = checkElem.val();    
                  
                  if( value > max){
                      return false;
                  }
              } 
                  
              return true;

          }, '');
          $.validator.addMethod('dateF', function (value, elem) {

              var checkElem = ($(elem).attr("dateF") ? $($(elem).attr("dateF")) : null);
              if (checkElem)  {
                  //var dateF = checkElem.val();    
                 var dateT =  Date.parse(document.getElementById('dateTo').value)
                 var dateF =  Date.parse(document.getElementById('dateFrom').value)
                  if( dateT < dateF){
                      return false;
                  }
              } 
                  
              return true;

          }, '');
          $.validator.addMethod('dateT', function (value, elem) {

              var checkElem = ($(elem).attr("dateT") ? $($(elem).attr("dateT")) : null);
              if (checkElem)  {
                  //var dateF = checkElem.val();    
                 var dateT =  Date.parse(document.getElementById('dateTo').value)
                 var dateF =  Date.parse(document.getElementById('dateFrom').value)
                  if( dateT < dateF){
                      return false;
                  }
              } 
                  
              return true;

          }, '');

          

          $('input[name="radioBtn"]').click(function(value, e){
              var ch = $('input[name="radioBtn"]:checked').val();
              var min = +$('#minT').val();
              var max = +$('#maxT').val();
              var setTempr = +$('#setT').val();
            
              if(ch == 'F'){
                  $('#minT').val(min + 32);
                  $('#maxT').val(max + 32);
                  $('#setT').val(setTempr + 32);
                  $('#radio2').attr('disabled','disabled');
                  $('#radio1').removeAttr('disabled','disabled');
                 
              }else{
                  $('#minT').val(min - 32);
                  $('#maxT').val(max - 32);
                  $('#setT').val(setTempr - 32);
                  $('#radio1').attr('disabled','disabled');
                  $('#radio2').removeAttr('disabled','disabled');
                  
              }
              
          });
              

          $('#minT').rules("add", {
              pattern: true,
              required: true,
              max:true,
              messages: {
                  pattern:'неверный формат',
                  required: "Заполните это поле",
                  max: "Не может быть больше max"
              }
          })

          $('#maxT').rules("add", {
              pattern:true,
              required: true,
              min:true,
              messages: {
                  pattern:'неверный формат',
                  required: "Заполните это поле",
                  min: "Не может быть меньше min"
              }
          })

          $('#setT').rules("add", {
              pattern: true,
              required: true,
              min:true,
              max:true,
              messages: {
                  pattern:'неверный формат',
                  required: "Заполните это поле",
                  min: "Не может быть меньше min",
                  max: "Не может быть больше max"
              }
          })

           $('#dateFrom').rules("add", {
            required: true,
            pattern:true,
            dateF:true,
            messages: {
                required: "Заполните это поле",
                pattern:'Неверный формат',
                dateT:"Больше окончательной даты"
            }
        })


        $('#dateTo').rules("add", {
            required: true,
            pattern: true,
            dateF:true,
            messages: {
                required: "Заполните это поле",
                pattern:'Неверный формат',
                dateF:"Меньше начальной даты"
            }
        })

      });











});
