/// <reference path="../../definition/jquery.d.ts" />

$(function () {
	$("#submitLogin").on("click", () => {
		$.ajax({
			type: 'POST',
			dataType: 'json',
			url: 'test.html',
			data: {
				"username": $("#usernameLogin input").val(),
				"password": $("#passwordLogin input").val()
			}
		}).done(data => {
			//Succes!
		});
	});
});