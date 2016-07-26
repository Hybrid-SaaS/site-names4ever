jQuery.noConflict();
$(document).ready(function () {
    var gaverder = true;

    var Click = function () {        
        var gaverder = true;
        event.stopPropagation();
        event.preventDefault();
        if ($(this).hasClass('active')) {
            gaverder = false;
        }
        // Een ander menu item staat open
        if (gaverder) {
            // Vouwt openstaande dicht       
            $('.drop-down-clickme.active > ul').hide();
            $('.drop-down-clickme.active').removeClass('active');
            // Vouwt deze open
            if ($(this).children('ul').is(':visible') == false) {
                $(this).addClass('active');
                $(this).children('ul').fadeIn("fast").show();
            }

        }
            // Hetzelfde menuitem dicht behalve bij hover
        else {
            if (!$(this).hasClass('disabled')) {
                $(this).children('ul').hide();
                $('.drop-down-clickme.active').removeClass('active');
            }
        }
        //Verander gaverder variabele waardoor volgende functie niet uitgevoerd wordt
        gaverder = false;
    };

    var Flyout = function () {
        var gaverder = true;
        if ($(this).hasClass('active')) {
            gaverder = false;
        }
        // Huidige hover staat nog niet open
        if (gaverder) {
            // Vouwt openstaande dicht       
            $('.drop-down-clickme.active > ul').hide();
            $('.drop-down-clickme.active').removeClass('active');
            $('.drop-down-clickme').removeClass('disabled');

            // Vouwt deze open
            if ($(this).children('ul').is(':visible') == false) {
                $(this).addClass('active');
                $(this).children('ul').fadeIn("fast").show();
                $(this).addClass('disabled');
                setTimeout(function () {
                    // enable click after 1 second
                    $('.drop-down-clickme.disabled').removeClass('disabled');
                }, 3000);
            }
        }
        //Verander gaverder variabele waardoor volgende functie niet uitgevoerd wordt
        gaverder = false;
    };

    var Flyin = function () {
        var gaverder = true;
        // Huidige hover staat nog niet open
        if (gaverder) {
            // Vouwt openstaande dicht       
            $('.drop-down-clickme.active > ul').hide();
            $('.drop-down-clickme.active').removeClass('active');
        }
        //Verander gaverder variabele waardoor volgende functie niet uitgevoerd wordt
        gaverder = false;
    };
    $(".drop-down-clickme").on("click touchend", Click);
    $(".drop-down-clickme").hoverIntent({
        over: Flyout,
        out: Flyin,
        timeout: 100,
        interval: 100

    });
    // Vouwt de openstaande dicht als ergens in de body geklikt wordt
    $("html").bind("click touchend", function () {
        event.stopPropagation();
        if (gaverder) {
            $('.drop-down-clickme.active > ul').slideUp(0);
            $('.drop-down-clickme.active').removeClass('active');
        }
        gaverder = true;
    });
    // Behalve als er in het openstaande menu geklikt wordt
    $('.drop-down-clickme > ul').bind("click touchend", function () {
        event.stopPropagation();
    });
});