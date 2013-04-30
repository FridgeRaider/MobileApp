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

/* Check cookies for valid login */
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

/* Called on index when user enters email/pass */
function logIn() {
	var username = document.getElementById("username");
	var password = document.getElementById("password");
	var ROOT = "https://hungrynorse.appspot.com/_ah/api";
	gapi.client.load('hungrynorse', 'v1', function() {
			console.log("About to Send Data");
			gapi.client.hungrynorse.users.login({"email":username.value, "password":password.value}).execute(logInResponse);
		}, ROOT);
}

/* Called by logIn() to deny or allow access with retreived information */
function logInResponse(data) {
	console.log(data);
	
	var curdate = new Date();
	if ( (curdate > Date.parse(data.dateJoined)) && data.dateJoined !== undefined){ 
		//successful login
		setCookie("validLogin", "true", 1);
		setCookie("currUser", data.email, 1);
		window.location.href = "main.html";
	} else {
		//unsuccessful login
		alert("Not a valid email or password!");
	}
}

/* Log user out */
function logOut() {
	setCookie("validLogin", "false", 1);
	setCookie("currUser", false, 1);
	window.location.href = "index.html";
}

/* Called from register screen to attempt to register with information */
function register(){
	var ROOT = "https://hungrynorse.appspot.com/_ah/api/hungrynorse/v1/users/";
	var email = document.getElementById("email");
	var password = document.getElementById("password");
	var displayName = document.getElementById("displayName");
	//alert(email.value + password.value + displayName.value);
	
	ROOT += escape(email.value);
	$.getJSON( ROOT, {} )
	.done(function( data ) {
		if( data.email !== undefined ){ alert("Email address is already taken! Did you forget your password?"); }
		else{
			var ROOT = "https://hungrynorse.appspot.com/_ah/api/hungrynorse/v1/users/";
			ROOT += displayName.value + "/" + encodeURIComponent(email.value) + "/" + password.value;
			$.post( ROOT, {} )
			.done( registerResponse )
			.fail( function() { alert("Something you entered broke! Please try again!"); });
		}
	});
}

/* Accept registration and redirect user to the login page */
function registerResponse(data){
	alert("Welcome to Fridge Raider! \n Your email and password can now be used to log in. Why don't you try it out?");
	window.location.href = "index.html";
}

/* Create a table by using the username stored in a cookie */
function createTable() {
	var ROOT = "https://hungrynorse.appspot.com/_ah/api/hungrynorse/v1/ingredient/";
	ROOT += escape(getCookie("currUser"));
	$.getJSON( ROOT, {} ).done( fillTable ); //execute fillTable when done getting JSON
}

/* Create a row for each item a user owns */
function fillTable(data) {
	$.each( data.ingredients, function( i, item ) {
		$('div.pinned').remove(); //deal with responsive tables

		var table = document.getElementById("ingredientTable");
		var newRow = table.insertRow(-1);
		var cell1 = newRow.insertCell(0);
		var cell2 = newRow.insertCell(1);
		var cell3 = newRow.insertCell(2);
		var cell4 = newRow.insertCell(3);
		cell1.innerHTML = item.ingredientName;
		cell2.innerHTML = item.quantity;
		cell2.setAttribute("onclick", "editQuantity(\"" + item.ingredientName + "\"," + item.quantity + ");");
		cell2.setAttribute("class", "editCell");
		cell3.innerHTML = item.expirationDate;
		cell3.setAttribute("onclick", "editExpiration(\"" + item.ingredientName + "\",\"" + item.expirationDate + "\");");
		cell3.setAttribute("class", "editCell");
		cell4.innerHTML = "<button class='btn delete-btn' onclick='removeIngredient(" + 
			"\"" + item.ingredientName + "\");'>X</button>";
	});
}

/* Accept an ingredient added and ask for quantity */
function addIngredient() {
	var ROOT = "https://hungrynorse.appspot.com/_ah/api/hungrynorse/v1/ingredients/";
	var ingredient = document.getElementById("ingredient-entry");
	var quantity = prompt("How many did get?","1");
	ROOT += ingredient.value + "/" + quantity + "/" + escape(getCookie("currUser"));
	$.getJSON( ROOT, {} )
	.done(function() {
		setTimeout(function(){window.location.reload()}, 500); //refresh the page to show results
	});
}

/* Change an ingredients quantity or expiration date */
function editQuantity(ingredientName, ingredientQuantity){
	var ROOT = "https://hungrynorse.appspot.com/_ah/api/hungrynorse/v1/ingredients/update/";
	ROOT += ingredientName + "/";
	ROOT += encodeURIComponent(getCookie("currUser")) + "/";
	var newQuantity = prompt("Quantity?", ingredientQuantity);
	ROOT += newQuantity;
	
	$.getJSON( ROOT, {} )
	.done(function() {
		setTimeout(function(){window.location.reload()}, 500); //refresh the page to show results
	});
}

/* User edits expiration date */
function editExpiration(ingredientName, expirationDate){
	var ROOT = "https://hungrynorse.appspot.com/_ah/api/hungrynorse/v1/ingredients/updateExDate/"
	ROOT += ingredientName + "/";
	ROOT += encodeURIComponent(getCookie("currUser")) + "/";
	var newExpiration = prompt("New expiration date?", expirationDate);
	ROOT += newExpiration;

	$.getJSON( ROOT, {} )
	.done(function() {
		setTimeout(function(){window.location.reload()}, 500); //refresh the page to show results
	});
}

/* delete an ingredient */
function removeIngredient(ingredientName){
	if( confirm("Delete this ingredient?") ){
		var ROOT = "https://hungrynorse.appspot.com/_ah/api/hungrynorse/v1/ingredients/"
		ROOT += ingredientName + "/";
		ROOT += encodeURIComponent(getCookie("currUser"));
		$.getJSON( ROOT, {} )
		.done(function() {
			window.location.reload(); //refresh the page to show results
		});
	}
}
