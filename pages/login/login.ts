/// <reference path="../../definition/jquery.d.ts" />

$(()=> {

    var $sumbitLogin = $("#submitLogin");

    $sumbitLogin.keydown(event=> {
        if (event.keyCode == 13) {
            $sumbitLogin.trigger('click');
        }
    });

    $sumbitLogin.on("click", () => {
        $.ajax({
                type: 'POST',
                dataType: 'json',
                cache: false,
                url: '/website/system/login',
                data: {
                    "username": $("#usernameLogin").val(),
                    "password": $("#passwordLogin").val()
                }
            })
            .done(data => {

                if (data.status == 'valid')
                    location.href = '/';
                else {
                    alert('Ongeldige inlognaam of wachtwoord!');
                }
            })
            .fail(() => alert('Fout tijdens controleren'));
    });
});