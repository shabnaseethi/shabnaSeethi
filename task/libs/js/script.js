$(window).on("load", function () {
  if ($("#preloader").length) {
    $("#preloader")
      .delay(1000)
      .fadeOut("slow", function () {
        $(this).remove();
      });
  }
});

$('#btn-1').click(()=>{
  
    $.ajax({
        url: "libs/php/postCodes.php",
        type: 'POST',
        dataType: 'json',
        data: {
            postalcode:$('#sel-postcode').val(),
            name:"shabnaseethi"
        },
        success: function(result) {
            

            if(result.status.name == "ok"){
                $('#detail-1').html(result['data'][0]['adminName3']);
                $('#detail-2').html(result['data'][0]['adminName2']);
                $('#detail-3').html(result['data'][0]['countryCode']);
                $('#detail-4').html(result['data'][0]['placeName']);
            }
           

           
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
            console.log(textStatus);
            console.log(errorThrown);
        }
    }); 
});

$('#btn-2').click(()=>{
    $.ajax({
        url: "libs/php/getOcean.php",
        type: 'POST',
        dataType: 'json',
        data: {
            latitude:$('#sel-lat').val(),
            longitude:$('#sel-long').val(),
            
        },
        success: function(result) {
          

            if(result.status.name == "ok"){
                $('#ocean-name').html(result['data']['name']);
              
            }          
           
        },
        error: function(jqXHR, textStatus, errorThrown) {
            $('#ocean-name').html("No Ocean Found!!!");
            
        }
    }); 
});

$('#btn-3').click(()=>{

   
    $.ajax({
        url: "libs/php/getWeather.php",
        type: 'POST',
        dataType: 'json',
        data: {
            latitude:$('#latitude').val(),
            longitude:$('#longitude').val(),           
        },
        success: function(result) {
          

            if(result.status.name == "ok"){
                $('#station').html(result['data']['stationName']);
                $('#clouds').html(result['data']['clouds']);
                $('#temperature').html(result['data']['temperature']);
                $('#humidity').html(result['data']['humidity']);
              
            }          
           
        },
        error: function(jqXHR, textStatus, errorThrown) {
          
           
            if(errorThrown){
                $('#station').html("Enter valid latitude and longitude!!!");
            }
            
        }
    }); 
});