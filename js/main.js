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
var flagConsole = false;
var weather_image = "img/dia1.jpg";
var context;
var circleCtx;
var canvas;
var user_longitude;
var user_latitude;
var temperaturaAtual = 0;
var offsetY = ((document.body.clientHeight / 2) - (document.body.clientWidth / 2));
var background_image = "img/neve3_360.png";
var background = [];
background["01d"] = "img/neve3_360.jpg";
background["02d"] = "img/dia1.jpg";
background["03d"] = "img/dia1.jpg";
background["04d"] = "img/dia1.jpg";
background["09d"] = "img/dia1.jpg";
background["10d"] = "img/dia1.jpg";
background["11d"] = "img/dia1.jpg";
background["13d"] = "img/dia1.jpg";
background["50d"] = "img/dia1.jpg";
background["01n"] = "img/dia1.jpg";
background["02n"] = "img/dia1.jpg";
background["03n"] = "img/dia1.jpg";
background["04n"] = "img/dia1.jpg";
background["09n"] = "img/dia1.jpg";
background["10n"] = "img/dia1.jpg";
background["11n"] = "img/dia1.jpg";
background["13n"] = "img/dia1.jpg";
background["50n"] = "img/dia1.jpg";

function getDate(date) {
    var str_month = document.getElementById('str_month'),
        month = date.getMonth() + 1,
        day = date.getDate();

    if(day < 10){
        day = "0" + day;
    }
    str_month.innerHTML = month + "-" + day;
}


function successCallback(position) 
{
   user_latitude = position.coords.latitude
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
	
		 map.src = w_image ;
		    context.drawImage(map, 0, offsetY, document.body.clientWidth,
		        document.body.clientWidth);
}

function updateImage(weather){
	background_image = background[weather];
}

function updateTemp(temp){
	temperaturaAtual = temp;
}



function getWeather(){
	oneShotFunc();
	lat=user_latitude;
	long=user_longitude;
	
	var codeResponse = null;
	$.get('http://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+long+'&APPID=d0f7ff959b61b2041decd8a55cc5ac5e',function(response){
		console.log(response);
		var codeResponse = response.weather[0].icon;
		updateImage(codeResponse);
		var tempAtual = response.main.temp;
		tempAtual = +(Math.round((tempAtual - 273) + "e+1")  + "e-1");
		updateTemp(tempAtual);
	});
	return 1;//arrumar na funcao
	
}

function onScreenStateChanged(previousState, changedState) {
	if(tizen.power.isScreenOn()){
		console.log("on");
//		updateImage(getWeather());
	}
	else{
	console.log("off");
	}
}

function getTime() {
    var str_hours = document.getElementById('str_hours'),
        str_console = document.getElementById('str_console'),
        str_minutes = document.getElementById('str_minutes'),
        str_temp = document.getElementById('str_temp'),
        
        date = tizen.time.getCurrentDateTime();

    str_hours.innerHTML = date.getHours();
    str_minutes.innerHTML = date.getMinutes();
    str_temp.innerHTML = temperaturaAtual + "°C";
    
    if (date.getHours() < 10) {
        str_hours.innerHTML = "0" + date.getHours();
    }
    if (date.getMinutes() < 10) {
        str_minutes.innerHTML = "0" + date.getMinutes();
    }
    drawMap(background["01d"]);


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
	
	$('body').click(function(event){
    	getWeather();
    })
    //tizen.power.setScreenStateChangeListener(onScreenStateChanged);
    document.addEventListener('tizenhwkey', function(e) {
        if (e.keyName === "back") {
            try {
                tizen.application.getCurrentApplication().exit();
            } catch (ignore) {}
        }
    });

    initDigitalWatch();
    
};
