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
 * 
 */



var TABLE_HEIGHT = 300,
    CIRCLE_RADIUS_CENTER = 6,
    CIRCLE_RADIUS_CITY = 2.5,
    CIRCLE_RADIUS_AROUND = 1.5,
    NEEDLE_LENGTH_HOUR = 0.65,
    NEEDLE_LENGTH_MINUTE = 0.8,
    NEEDLE_LENGTH_SECOND = 0.8,
    NEEDLE_WIDTH_HOUR = 4,
    NEEDLE_WIDTH_MINUTE = 2,
    NEEDLE_WIDTH_SECOND = 2,
    LOCAION_AROUND_CIRCLE = 0.9,
    LOCATION_AROUND_LINE_START = 0.82,
    LOCATION_AROUND_LINE_END = 0.92,
    cityArray = null,
    colorCity = null,
    canvas = null,
    context = null,
    circleCtx = null,
    centerX = document.body.clientWidth / 2,
    centerY = document.body.clientHeight / 2,
    watchRadius = document.body.clientWidth / 2,
    offsetY = ((document.body.clientHeight / 2) - (document.body.clientWidth / 2)),
    
	user_longitude,
	user_latitude;

function setSize() {
    var pageWatch = document.getElementById('pageWatch'),
        divTable = document.getElementById('selectTable');
    pageWatch.style.width = document.body.clientWidth + 'px';
    pageWatch.style.height = document.body.clientHeight + 'px';
    divTable.style.paddingTop = (centerY - (TABLE_HEIGHT / 2)) + 'px';
}

function checkColorCity() {
    var i = 0;

    for (i = 0; i < colorCity.length; i++) {
        if (localStorage.getItem(colorCity[i].colorCode) === null) {
            localStorage.setItem(colorCity[i].colorCode, 0);
        }
    }
}

function setColorCity() {
    var i = 0;

    for (i = 0; i < colorCity.length; i++) {
        colorCity[i].cityId = localStorage.getItem(colorCity[i].colorCode);
    }
}

function addSelectTable() {
    var i = 0,
        j = 0,
        div = null,
        canvas = null,
        select = null,
        option = null,
        divTable = document.getElementById('selectTable'),
        optionFragment = document.createDocumentFragment(),
        selectFragment = document.createDocumentFragment(),
        divFragment = document.createDocumentFragment();

    for (i = 0; i < colorCity.length; i++) {
        div = document.createElement('div');
        div.setAttribute('align', 'center');
        canvas = document.createElement('canvas');
        canvas.id = 'color-' + i;
        canvas.style.verticalAlign = 'middle';
        canvas.style.backgroundColor = '#' + colorCity[i].colorCode;
        canvas.style.marginRight = '5px';
        canvas.width = 40;
        canvas.height = 40;
        select = document.createElement('select');
        select.className = 'selectCity';
        select.id = 'colorCity-' + i;
        select.style.fontSize = '2em';
        select.style.verticalAlign = 'middle';
        for (j = 0; j < cityArray.length; j++) {
            option = document.createElement('option');
            option.text = cityArray[j].cityName;
            option.value = j;
            optionFragment.appendChild(option);
        }
        select.appendChild(optionFragment);
        selectFragment.appendChild(canvas);
        selectFragment.appendChild(select);
        div.appendChild(selectFragment);
        divFragment.appendChild(div);
    }
    divTable.appendChild(divFragment);
}

function getSelectCity(event) {
    var j = 0,
        flag = 0,
        colorId = 0,
        cityId = 0,
        thisCity = event.target;

    colorId = thisCity.id.replace('colorCity-', '');
    cityId = thisCity.value;
    flag = 0;

    for (j = 0; j < colorCity.length; j++) {
        if (cityId !== "0" && cityId === colorCity[j].cityId) {
            flag = 1;
        }
    }
    if (flag === 1) {
        alert("City Already Selected!");
        thisCity.value = colorCity[colorId].cityId;
    } else if (flag === 0) {
        colorCity[colorId].cityId = thisCity.value;
    }
}

function checkSelectedCity() {
    var i = 0;

    for (i = 0; i < colorCity.length; i++) {
        document.getElementsByClassName('selectCity')[i].addEventListener('change', getSelectCity);
    }
}

function drawMap(weather) {
	var map = new Image();
	
	if (weather==1)  {
		 map.src = 'img/galaxy.jpg' ;
		    context.drawImage(map, 0, offsetY, document.body.clientWidth,
		        document.body.clientWidth);
	} else
		 map.src = 'img/map.png' ;
			context.drawImage(map, 0, offsetY, document.body.clientWidth,
					document.body.clientWidth);

   
}

function drawCircle(x, y, radius, color) {
    circleCtx.beginPath();
    circleCtx.fillStyle = color;
    circleCtx.arc(x, y, radius, 0, 2 * Math.PI);
    circleCtx.fill();
    circleCtx.closePath();
}

function drawNeedle(angle, length, width, color) {
    var dxi = 0,
        dyi = 0,
        dxf = watchRadius * Math.cos(angle) * length,
        dyf = watchRadius * Math.sin(angle) * length;

    context.beginPath();
    context.lineWidth = width;
    context.strokeStyle = color;
    context.moveTo(centerX + dxi, centerY + dyi);
    context.lineTo(centerX + dxf, centerY + dyf);
    context.stroke();
    context.closePath();
}

function drawWatchLayout() {
    var i = 0,
        dxi = 0,
        dyi = 0,
        dxf = 0,
        dyf = 0,
        angle = 0;    	

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);    
    
    
    
    	drawMap(getWeather());
    

    context.beginPath();
    context.lineWidth = 2;
    context.strokeStyle = '#454545';

    // circle markers from 1 to 11 o'clock
    for (i = 1; i <= 11; i++) {
        angle = (i - 3) * (Math.PI * 2) / 12;
        dxf = centerX + (watchRadius * LOCAION_AROUND_CIRCLE) * Math.cos(angle);
        dyf = centerY + (watchRadius * LOCAION_AROUND_CIRCLE) * Math.sin(angle);
        drawCircle(dxf, dyf, CIRCLE_RADIUS_AROUND, '#454545');
    }

    context.closePath();

    // line marker on 12 o'clock
    context.beginPath();
    context.lineWidth = 3;
    context.strokeStyle = '#454545';

    // 9 = (12-3) for calculating the angle at 12 o'clock
    angle = 9 * (Math.PI * 2) / 12;
    dxi = centerX + (watchRadius * LOCATION_AROUND_LINE_START) * Math.cos(angle);
    dyi = centerY + (watchRadius * LOCATION_AROUND_LINE_START) * Math.sin(angle);
    dxf = centerX + (watchRadius * LOCATION_AROUND_LINE_END) * Math.cos(angle);
    dyf = centerY + (watchRadius * LOCATION_AROUND_LINE_END) * Math.sin(angle);
    context.moveTo(dxi, dyi);
    context.lineTo(dxf, dyf);
    context.stroke();
    context.closePath();
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



function Get(yourUrl){
	var Httpreq = new XMLHttpRequest(); // a new request
	Httpreq.open("GET",yourUrl,false);
	Httpreq.send(null);
	return Httpreq.responseText;          

	    }



function getWeather(){
	oneShotFunc();
	lat=user_latitude;
	long=user_longitude;
	console.log("PRY",lat);
	console.log(long);
	
	var temp = Get('http://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+long+'&APPID=d0f7ff959b61b2041decd8a55cc5ac5e');	
	console.log(temp);
	var json_objc = JSON.parse(temp);
	weather = json_objc.weather[0].main;
	console.log("tempo" ,weather);
	
	
//	console.log(temp);
	
//	return weather;//arrumar na funcao
	
}


function onScreenStateChanged(previousState, changedState) {
	if(tizen.power.isScreenOn()){
		console.log("on");
	}
	else{
	console.log("off");
	}
}


function drawWatchContentCity(hour, minute, color, mapX, mapY) {
    var hourNeedleAngle = Math.PI * (((hour + minute / 60) / 6) - 0.5);

    // Draw the marker on the map
    drawCircle(centerX + mapX, centerY + mapY, CIRCLE_RADIUS_CITY, color);
    context.shadowBlur = 5;
    context.shadowOffsetX = 1;
    context.shadowOffsetY = 1;

    // Draw the hour needle
    context.shadowColor = '#454545';
    context.shadowBlur = 10;
    context.shadowOffsetX = 2;
    context.shadowOffsetY = 2;

    drawNeedle(hourNeedleAngle, NEEDLE_LENGTH_HOUR, NEEDLE_WIDTH_HOUR, color);

    context.shadowBlur = 0;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;

    // Draw the center circle
    drawCircle(centerX, centerY, CIRCLE_RADIUS_CENTER, '#454545');
    context.shadowBlur = 0;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
}

function drawWatchContentDefault(hour, minute, second, mapX, mapY) {
    var minuteNeedleAngle = Math.PI * (((minute + second / 60) / 30) - 0.5),
        secondNeedleAngle = Math.PI * ((second / 30) - 0.5);

    context.shadowBlur = 5;
    context.shadowOffsetX = 1;
    context.shadowOffsetY = 1;

    // Draw the minute needle
    drawNeedle(minuteNeedleAngle, NEEDLE_LENGTH_MINUTE, NEEDLE_WIDTH_MINUTE, '#454545');

    // Draw the second needle
    drawNeedle(secondNeedleAngle, NEEDLE_LENGTH_SECOND, NEEDLE_WIDTH_SECOND, '#c7c7c7');

    // Draw the hour needle
    drawWatchContentCity(hour, minute, '#454545', mapX, mapY);
}

function drawWatch() {
    var i = 0,
        date = null,
        hour = null,
        minute = null,
        second = null;

    try {
        date = tizen.time.getCurrentDateTime();
        hour = date.getHours();
        minute = date.getMinutes();
        second = date.getSeconds();
    } catch (error) {
        console.error("getCurrentDateTime(): " + error.message);
    }

    drawWatchLayout();
    drawWatchContentDefault(hour, minute, second, 0, 0);

    try {
        for (i = 0; i < colorCity.length; i++) {
            if (cityArray[colorCity[i].cityId].tzid !== 'NONE') {
                hour = tizen.time.getCurrentDateTime().toTimezone(
                    cityArray[colorCity[i].cityId].tzid).getHours();
                drawWatchContentCity(hour, minute, colorCity[i].colorCode,
                    cityArray[colorCity[i].cityId].mapX * (document.body.clientWidth / 360),
                    cityArray[colorCity[i].cityId].mapY * (document.body.clientWidth / 360));
            }
        }
    } catch (error) {
        console.error("getCurrentDateTime(): " + error.message);
    }
}

function displayWatch() {
    document.getElementById('pageWatch').style.display = 'block';
    document.getElementById('pageCity').style.display = 'none';
}

function displayCity() {
    var i = 0;

    for (i = 0; i < colorCity.length; i++) {
        document.getElementsByClassName('selectCity')[i].value = colorCity[i].cityId;
    }

    document.getElementById('pageWatch').style.display = 'none';
    document.getElementById('pageCity').style.display = 'block';
}

function appInit() {
    setSize();
    checkColorCity();
    setColorCity();
    addSelectTable();
    checkSelectedCity();

    canvas = document.getElementById('myCanvas');
    context = canvas.getContext('2d');
    circleCtx = canvas.getContext('2d');
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;

    setInterval(function() {
        drawWatch();
    }, 500);

    

    // eventListener
    document.getElementById('myCanvas').addEventListener('touchstart', function(ev) {
        var touchList = null;

        touchList = ev.touches;

        if (touchList.length === 2) {
            displayCity();
        }
    });
    
    tizen.power.setScreenStateChangeListener(onScreenStateChanged);

    document.getElementById('btnSave').addEventListener('click', function() {
        var i = 0;

        for (i = 0; i < colorCity.length; i++) {
            localStorage.setItem(colorCity[i].colorCode, colorCity[i].cityId);
        }
        displayWatch();
        drawWatch();
    });

    document.getElementById('btnCancel').addEventListener('click', function() {
        setColorCity();
        displayWatch();
        drawWatch();
    });
}

window.onload = function() {
    appInit();

    // add eventListener for tizenhwkey
    window.addEventListener('tizenhwkey', function(e) {
        if (e.keyName === 'back') {
            if (document.getElementById('pageCity').style.display === 'block') {
                setColorCity();
                displayWatch();
                
            } else {
                try {
                    tizen.application.getCurrentApplication().exit();
                } catch (error) {
                    console.error("getCurrentApplication(): " + error.message);
                }
            }
        }
    });
};
