jQuery(document).ready(function () {	

    jQuery(window).load(function () {

        /* set min-height of #Content so that the page is at least of window's height */
        (function () {
            var h = jQuery(window).height();
            h -= jQuery('body .wrapper > footer').outerHeight(true);
            h -= jQuery('#MainNav').outerHeight(true);
            h -= 200;

            jQuery('#Content, #Content > .container, .four-o-four').css('min-height', h);
        })();

        /* MOBILE MENUS: */
        /* shopping cart */
        var $body = jQuery('body');
        (function () {
            var shoppingCart = {};
            shoppingCart.$wrap = jQuery('.shopping-cart-widget');
            shoppingCart.$button = jQuery('> .btn', shoppingCart.$wrap);
            shoppingCart.$panel = jQuery('[role="complementary"]', shoppingCart.$wrap);
            shoppingCart.$unclick = null;

            shoppingCart.$panel.click(function (e) {
                e.stopPropagation();
            });

            shoppingCart.$button.click(function (e) {
                e.stopPropagation();
                jQuery('body').removeClass('active-nav').toggleClass('active-mini-cart');
                if (shoppingCart.$unclick == null) {
                    shoppingCart.$wrap.prepend('<div class="unclick"></div>');
                    shoppingCart.$unclick = jQuery('.unclick', shoppingCart.$wrap);
                    var height = jQuery("#Content").height() + jQuery('footer').height() - 11;
                    shoppingCart.$panel.height(height + jQuery('#MainNav').height());
                    shoppingCart.$unclick.height(height + 90);
                    shoppingCart.$unclick.click(function () {
                        $body.removeClass('active-mini-cart active-nav');
                    });
                }
            });
        })();

        /* navigation */
        (function () {
            var navMenu = {};
            navMenu.$wrap = jQuery('#MainNav nav');
            navMenu.$button = jQuery('.navbar-header .btn', navMenu.$wrap);
            navMenu.$panel = jQuery('[role="navigation"]', navMenu.$wrap);
            navMenu.$unclick = null;

            navMenu.$button.click(function (e) {
                e.stopPropagation();
                jQuery('body').removeClass('active-mini-cart').toggleClass('active-nav');
                if (navMenu.$unclick == null) {
                    navMenu.$wrap.prepend('<div class="unclick"></div>');
                    navMenu.$unclick = jQuery('.unclick', navMenu.$wrap);
                    var height = jQuery("#Content").height() + jQuery('footer').height();
                    navMenu.$panel.height(height);
                    navMenu.$unclick.height(height);
                    navMenu.$unclick.click(function () {
                        $body.removeClass('active-mini-cart active-nav');
                    });
                }
            });
        })();
    });

	/* remove element from wishlist after button close click */
	jQuery("button.close").click(function(){
		jQuery(this).closest(".shop-summary-item").fadeOut(200);
	});

});