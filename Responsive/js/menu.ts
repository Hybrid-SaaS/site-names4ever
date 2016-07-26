jQuery(document).ready(function () {
    var gaverder = true;
    var Click = function () {
        var gaverder = true;
        event.stopPropagation();
        event.preventDefault();
        if (jQuery(this).hasClass('active')) {
            gaverder = false;
        }
        // Een ander menu item staat open
        if (gaverder) {
            // Vouwt openstaande dicht       
            jQuery('.drop-down-clickme.active > ul').slideUp(0);
            jQuery('.drop-down-clickme.active').removeClass('active');
            // Vouwt deze open
            if (jQuery(this).children('ul').is(':visible') == false) {
                jQuery(this).addClass('active');
                jQuery(this).children('ul').slideToggle(0);
            }

        }
        // Hetzelfde menuitem dicht
        else {
            jQuery(this).children('ul').slideToggle(0);
            jQuery('.drop-down-clickme.active').removeClass('active');
        }
        //Verander gaverder variabele waardoor volgende functie niet uitgevoerd wordt
        gaverder = false;
    };

    var Hover = function () {
        var gaverder = true
	if (jQuery(this).hasClass('active')) {
            gaverder = false;
        }
        // Huidige hover staat nog niet open
        if (gaverder) {
            // Vouwt openstaande dicht       
            jQuery('.drop-down-clickme.active > ul').slideUp(0);
            jQuery('.drop-down-clickme.active').removeClass('active');
            // Vouwt deze open
            if (jQuery(this).children('ul').is(':visible') == false) {
                jQuery(this).addClass('active');
                jQuery(this).children('ul').slideToggle(0);
            }

        }
        //Verander gaverder variabele waardoor volgende functie niet uitgevoerd wordt
        gaverder = false;
    };

    jQuery(".drop-down-clickme").on("click touchend", Click);
    jQuery(".drop-down-clickme").hover(Hover);

    // Vouwt de openstaande dicht als ergens in de body geklikt wordt
    jQuery("html").bind("click touchend", function () {
        if (gaverder) {
            jQuery('.drop-down-clickme.active > ul').slideUp(0);
            jQuery('.drop-down-clickme.active').removeClass('active');
        }
        gaverder = true;
    });
    // Behalve als er in het openstaande menu geklikt wordt
    jQuery('.drop-down-clickme > ul').bind("click touchend", function () {
        event.stopPropagation();
    });
});
