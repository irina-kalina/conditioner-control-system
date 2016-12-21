
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

 
    $("#dateFrom").datepicker({ 
        showOn:"button",
        dateFormat: 'mm.dd.yy',
        changeMonth: true,
        onSelect: function( selectedDate ) {
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent("change", false, true);
            this.dispatchEvent(evt);

            $( "#dateTo" ).datepicker( "option", "minDate", selectedDate );
            
        },
        beforeShow: function(id) {
            $('#ui-datepicker-div').css("padding","1%");
          }

    });
       
       
    $("#dateTo").datepicker({ 
        showOn:"button",
        dateFormat: 'mm.dd.yy',
        changeMonth: true,
        onSelect: function( selectedDate ) {
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent("change", false, true);
            this.dispatchEvent(evt);//
                $( "#dateFrom" ).datepicker( "option", "maxDate", selectedDate );

            },
            beforeShow: function(id) {
            $('#ui-datepicker-div').css("padding","1%");
          }


     });


    $('input[name="radioBtn"]').click(function(value, e){
        var ch = $('input[name="radioBtn"]:checked').val();
        var min = +$('#minT').val();
        var max = +$('#maxT').val();
        var setTempr = +$('#setT').val();
      
        if(ch == 'F'){
            $('#minT').val(min + 32);
            $('#maxT').val(max + 32);
            $('#setT').val(setTempr + 32);
           
        }else{
            $('#minT').val(min - 32);
            $('#maxT').val(max - 32);
            $('#setT').val(setTempr - 32)
            
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
            messages: {
                required: "Заполните это поле",
                pattern:'неверный формат'
            }
        })


        $('#dateTo').rules("add", {
            required: true,
            pattern: true,
            messages: {
                required: "Заполните это поле",
                pattern:'неверный формат'
            }
        })

});


