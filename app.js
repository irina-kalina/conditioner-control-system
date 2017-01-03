
$(document).ready(function() {
     $('#temprForm').validate({
        highlight: function(element, errorClass) {
            $(element).addClass("invalidElem");
        },
        unhighlight: function(element, errorClass) {
            $(element).removeClass("invalidElem");
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

 
    $('input[name="radioBtn"]').click(function(value, elem){
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
            $('#setT').val(setTempr - 32)

            $('#radio1').attr('disabled','disabled');
            $('#radio2').removeAttr('disabled','disabled');
        }
       
        
    });
    	

        $('#minT').rules("add", {
            pattern: true,
            required: true,
           // max:true,
            messages: {
                pattern:'Неверный формат',
                required: "Заполните это поле",
                 //max: "Не может быть больше max"
            }
        })

        $('#maxT').rules("add", {
            pattern:true,
            required: true,
           // min:true,
            messages: {
                pattern:'Неверный формат',
                required: "Заполните это поле",
               // min: "Не может быть меньше min"
            }
        })

        $('#setT').rules("add", {
            pattern: true,
            required: true,
            min:true,
            max:true,
            messages: {
                pattern:'Неверный формат',
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


