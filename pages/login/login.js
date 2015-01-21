/// <reference path="../../definition/jquery.d.ts" />
$(function () {
    $("#submitLogin").on("click", function () {
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: 'test.html',
            data: {
                "username": $("#usernameLogin input").val(),
                "password": $("#passwordLogin input").val()
            }
        }).done(function (data) {
            //Succes!
        });
    });
});
