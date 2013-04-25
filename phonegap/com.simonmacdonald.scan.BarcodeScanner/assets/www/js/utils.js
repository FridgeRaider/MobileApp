function setCookie(c_name,value,exdays) {
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
	document.cookie=c_name + "=" + c_value;
}

function getCookie(c_name) {
	var c_value = document.cookie;
	var c_start = c_value.indexOf(" " + c_name + "=");
	if (c_start == -1) {
		c_start = c_value.indexOf(c_name + "=");
		}
	if (c_start == -1) {
		c_value = null;
		}
	else {
		c_start = c_value.indexOf("=", c_start) + 1;
		var c_end = c_value.indexOf(";", c_start);
		if (c_end == -1) {
			c_end = c_value.length;
		}
		c_value = unescape(c_value.substring(c_start,c_end));
	}
	return c_value;
}

function checkLogin() {
	var valid = getCookie("validLogin");
	if (valid != "true") {
		window.location.href = "index.html";
	}
	else {
		//alert("Good login!");
	}
}

function formcenter() {
	var center = $("#formcenter");
	center.height( window.innerHeight - 20 );
	center.width( window.innerWidth );
}

function logIn() {
	var username = document.getElementById("username");
	var password = document.getElementById("password");
	var ROOT = "https://hungrynorse.appspot.com/_ah/api";
	gapi.client.load('hungrynorse', 'v1', function() {
			console.log("About to Send Data");
			gapi.client.hungrynorse.users.login({"email":username.value, "password":password.value}).execute(logInResponse);
		}, ROOT);
}

function logInResponse(data){
	console.log(data);
	
	var curdate = new Date();
	if ( (curdate > Date.parse(data.dateJoined)) && data.dateJoined !== undefined){ 
		//successful login
		setCookie("validLogin", "true", 1);
		window.location.href = "main.html";
	} else {
		//unsuccessful login
		alert("Not a valid email or password!");
	}
}

