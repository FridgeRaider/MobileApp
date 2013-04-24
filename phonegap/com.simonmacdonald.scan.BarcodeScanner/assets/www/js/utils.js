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
		window.location.href = "main.html";
	} else {
		alert("Not a valid email or password!");
	}
}