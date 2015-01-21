/// <reference path="../../definition/jquery.d.ts" />
$(function () {
    $("#submitLogin").on("click", function () {
        $.ajax({
            type: 'POST',
            dataType: 'json',
            cache: false,
            url: '/website/system/login',
            data: {
                "username": $("#usernameLogin").val(),
                "password": $("#passwordLogin").val()
            }
        }).done(function (data) {
            if (data.status == 'valid')
                location.href = '/';
            else {
                alert('Ongeldige inlognaam of wachtwoord!');
            }
        }).fail(function () { return alert('Fout tijdens controleren'); });
    });
});
