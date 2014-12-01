/// <reference path="../../definition/jquery.d.ts" />
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

    var runner = function () {
        $slides.eq(currentIndex).fadeOut(1000);

        currentIndex++;
        if (currentIndex >= $slides.length)
            currentIndex = 0;

        $slides.eq(currentIndex).fadeIn(1000);
    };
    runner();
    setInterval(runner, 10000);

    //
    $('#topcat').append($('#topcategory'));

    $.getJSON('/data/product/DEALOFTHEDAY/related-products').done(function (data) {
        var $deal = $('#deal');
        $('#deal').append('<div class="head">Deal of the Day</div>');

        if (data.related && data.related["Deal"]) {
            var product = data.related["Deal"][0];
            var $img = $('<img src="/image/product/guid/' + encodeURIComponent(product.guid) + '?width=175&height=175" />');
            $img.attr({ 'title': product.productcode + '\n' + product.description });
            $deal.data('url', product.url);

            $deal.append($img);

            $deal.append($('<div class="title"></div>').text(product.description));
            $deal.append($('<div class="price-original"></div>').text('Van € ' + product['price-original'].toFixed(2).replace('.', ',')));
            $deal.append($('<div class="price"></div>').text('Voor € ' + product.price.toFixed(2).replace('.', ',')));

            $deal.attr({ 'title': product.productcode + '\n' + product.description });

            $deal.click(function () {
                location.href = $deal.data('url');
            });

            $deal.fadeIn(750);
        }
    });
});
