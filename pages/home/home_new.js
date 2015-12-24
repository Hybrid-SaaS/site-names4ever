﻿/// <reference path="../../definition/jquery.d.ts" />
//home page
//onload
$(function () {
    var $home = $('#home');
    var $homeslides = $('#homeslide a');

    for (var x = 0; x < $homeslides.length; x++) {
        var $slide = $homeslides.eq(x);

        var $img = $('<img src="' + $slide.text() + '" data-href="' + $slide.attr('href') + '" class="slide" />');

        $img.on('click', function (event) {
            location.href = $(event.delegateTarget).data('href');
        });

        $home.append($img);
    }
    var $slides = $home.find('img');

    var currentIndex = $slides.length - 1;

    
    // Top category
    $('#topcat').append($('#topcategory'));


    // Deal of the week
    $.getJSON('/data/product/DEALOFTHEDAY/related-products').done(function (data) {
        var $deal = $('#deal');
        $('#deal').append('<div class="head">Deal of the Week</div>');

        if (data.related && data.related["Deal"]) {
            var product = data.related["Deal"][0];
            var $img = $('<img src="/image/product/guid/' + encodeURIComponent(product.guid) + '?width=175&height=175" />');
            $img.attr({ 'title': product.productcode + '\n' + product.description });
            $deal.data('url', product.url);

            $deal.append($img);

            $deal.append($('<div class="title"></div>').text(product.description));

            var from = '';
            var to = '';
            switch (WebPage.Data.language) {
                case 'nl': {
                    from = 'Van';
                    to = 'Voor';
                    break;
                }
                case 'de': {
                    from = 'Bisher';
                    to = 'Jetzt';
                    break;
                }
                case 'en': {
                    from = 'From';
                    to = 'Now';
                    break;
                }
            }

            if (WebPage.Data.country == 'gb') {
                $deal.append($('<div class="price-original"></div>').text(from + ' £ ' + product['price-original'].toFixed(2).replace('.', ',')));
                $deal.append($('<div class="price"></div>').text(to + ' £ ' + product.price.toFixed(2).replace('.', ',')));
            } else {
                $deal.append($('<div class="price-original"></div>').text(from + ' € ' + product['price-original'].toFixed(2).replace('.', ',')));
                $deal.append($('<div class="price"></div>').text(to + ' € ' + product.price.toFixed(2).replace('.', ',')));
            }
            $deal.attr({ 'title': product.productcode + '\n' + product.description });

            $deal.click(function () {
                location.href = $deal.data('url');
            });

            $deal.fadeIn(750);
        }
    });

    // Populaire producten Home
    $.getJSON('/data/product/POPULAIRHOME/related-products').done(function (data) {
        var $populair = $('#populair');
        var title = '';
        switch (WebPage.Data.language) {
            case 'nl':
                title = 'Populaire producten';
                break;
            case 'de':
                title = 'Beliebte Produkte';
                break;
            case 'en':
                title = 'Popular products';
                break;
            case 'es':
                title = 'Productos populares';
                break;
        }
        $('#populair').append('<div class="head">'+title+'</div>');

        if (data.related && data.related["Populair"]) {

            

            var product = data.related["Populair"][1];
            var $img = $('<img src="/image/product/guid/' + encodeURIComponent(product.guid) + '?width=175&height=175" />');
           
            $img.attr({ 'title': product.productcode + '\n' + product.description });
            $populair.data('url', product.url);

            $populair.append($img);

            $populair.append($('<div class="title"></div>').text(product.description));

            if (WebPage.Data.country == 'gb') {
                $populair.append($('<div class="price"></div>').text(' £ ' + product.price.toFixed(2).replace('.', ',')));
            } else {                
                $populair.append($('<div class="price"></div>').text(' € ' + product.price.toFixed(2).replace('.', ',')));
            }
            $populair.attr({ 'title': product.productcode + '\n' + product.description });

            $populair.click(function () {
                location.href = $populair.data('url');
            });

            $populair.fadeIn(750);
            
        }
    });
});
