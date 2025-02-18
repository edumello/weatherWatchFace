/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var flagConsole = false,
	context,
	circleCtx,
	canvas,
	user_longitude,
	user_latitude,
	temperaturaAtual = 0,
	temperaturaKevin = 273,
	tipoTemperatura = "c",
	ampm = "AM",
	tipoHora = 24,
	offsetY = ((document.body.clientHeight / 2) - (document.body.clientWidth / 2)),
	background_image = "img/sun.png",
	background = [];
background["01d"] = "img/sun.png";
background["02d"] = "img/sol.png";
background["03d"] = "img/sol.png";
background["04d"] = "img/nublado.png";
background["09d"] = "img/360x360.png";
background["10d"] = "img/360x360.png";
background["11d"] = "img/raios3.png";
background["13d"] = "img/neve3.jpg";
background["50d"] = "img/nevoa.png";
background["01n"] = "img/noite1.jpg";
background["02n"] = "img/3noite.jpg";
background["03n"] = "img/3noite.jpg";
background["04n"] = "img/moon_nublado.jpg";
background["09n"] = "img/night_rain.jpg";
background["10n"] = "img/night_rain.png";
background["11n"] = "img/raios2.png";
background["13n"] = "img/neve1.jpg";
background["50n"] = "img/nevoa2.png";

function successCallback(position) 
{
   user_latitude = position.coords.latitude;
   user_longitude = position.coords.longitude;
}

function errorCallback(error) 
{
   var errorInfo = document.getElementById("locationInfo");

   switch (error.code) 
   {
      case error.PERMISSION_DENIED:         
         errorInfo.innerHTML = "User denied the request for Geolocation.";
         break;
      case error.POSITION_UNAVAILABLE:
         errorInfo.innerHTML = "Location information is unavailable.";
         break;
      case error.TIMEOUT:
         errorInfo.innerHTML = "The request to get user location timed out.";
         break;
      case error.UNKNOWN_ERROR:
         errorInfo.innerHTML = "An unknown error occurred.";
         break;
   }
}  
	 

function oneShotFunc() 
{
   if (navigator.geolocation) 
   {
      navigator.geolocation.getCurrentPosition(successCallback, errorCallback, 
                                               {maximumAge: 60000});
   } 
   else 
   {
      document.getElementById("locationInfo").innerHTML = "Geolocation is not supported.";
   }
}

function drawMap(w_image) {
	var map = new Image();
	try{
		 map.src = w_image ;
		    context.drawImage(map, 0, offsetY, document.body.clientWidth,
		        document.body.clientWidth);
	}
	catch(ignore){
		
	}
}

function updateImage(weather){
	background_image = background[weather];
}

function updateTemp(tempAtual){
	if (tipoTemperatura == "c"){
		tempAtual = +(Math.round((tempAtual - 273) + "e+0")  + "e-0");
		temperaturaAtual = tempAtual + "°C";
	}
	else{
		tempAtual = +(Math.round((((tempAtual - 273.15) * 1.8) + 32) + "e+0")  + "e-0");
		temperaturaAtual = tempAtual + "°F";
	}
	return temperaturaAtual;
}

function trocarTemp(){
	if (tipoTemperatura == "c"){
		tipoTemperatura = "f";
	}else{
		tipoTemperatura = "c";
	}
}

function getWeather(){
	oneShotFunc();
	var lat = user_latitude,
		long = user_longitude,
		codeResponse = null;
	
	$.get('http://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+long+'&APPID=d0f7ff959b61b2041decd8a55cc5ac5e',function(response){
		try{
			codeResponse = response.weather[0].icon;
			temperaturaKevin = response.main.temp;
			updateImage(codeResponse);
		}
		catch(ignore){
		}	
	});
}

function onScreenStateChanged() {
	if(tizen.power.isScreenOn()){
		getWeather();
	}
}
function trocarHora(){
	if( tipoHora == 24 ){
		tipoHora = 12;
	}
	else{
		tipoHora = 24;
	}
}

function updateHour(hora){
	if( tipoHora == 12 ){
		ampm = "AM";
		if (hora >= 12) {
			hora = hora - 12;
			ampm = "PM";
		}
		if (hora == 0) {
			hora = 12;
		}
	}
	if (hora < 10) {
		hora = "0" + hora;
    }
	return hora;
}

function getTime() {
    var str_hours = document.getElementById('str_hours'),
        str_console = document.getElementById('str_console'),
        str_minutes = document.getElementById('str_minutes'),
        str_temp = document.getElementById('str_temp'),
        str_ampm = document.getElementById('str_AMPM'),
        
        date = tizen.time.getCurrentDateTime();

    str_hours.innerHTML = updateHour(date.getHours());
    str_minutes.innerHTML = date.getMinutes();
    //str_temp.innerHTML = 20 + "°C";
    str_temp.innerHTML = updateTemp(temperaturaKevin);
    str_ampm.innerHTML = ampm;
    
    if (date.getMinutes() < 10) {
        str_minutes.innerHTML = "0" + date.getMinutes();
    }
    drawMap(background_image);


    if (flagConsole) {
        str_console.style.visibility = 'visible';
        flagConsole = false;
    } else {
        str_console.style.visibility = 'hidden';
        flagConsole = true;
    }
    
}

function initDigitalWatch() {
    setInterval(getTime, 500);
}


window.onload = function() {
	canvas = document.getElementById('myCanvas');
    context = canvas.getContext('2d');
    circleCtx = canvas.getContext('2d');
    canvas.width = 360;
    canvas.height = 360;
	
    tizen.power.setScreenStateChangeListener(onScreenStateChanged);
    $("#str_temp").click(function(){
    	trocarTemp();
    });
    
    $("#rec_time").click(function(){
    	trocarHora();
    	$('#str_AMPM').toggleClass("hide");
    });
    document.addEventListener('tizenhwkey', function(e) {
        if (e.keyName === "back") {
            try {
                tizen.application.getCurrentApplication().exit();
            } catch (ignore) {}
        }
    });

    initDigitalWatch();
    
};
