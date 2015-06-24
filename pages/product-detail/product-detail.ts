/// <reference path="../../definition/jquery.d.ts" />
/// <reference path="../../../../../Hybrid SaaS/Hybrid SaaS Software (Aspekto)/Hybrid SaaS Software/Website/Core/Website/Script/Product-detail.ts" />

if ($('.sheet')) {
    alert("test");
    $('.sheet').html('');
}

$(() => {


    //small to big

    var $smallImages = $('.smallimage');
    var $smallImagesFrames = $('.product-image-rest .imageFrame');

    $smallImages.click((event) => {

        $smallImagesFrames.removeClass('active');

        var $imagebig = $('#imagebig');
        var $target = $(event.target);
        var url = '/image/product/guid/' + encodeURIComponent($imagebig.data('guid')) + '/' + $target.data('index') + '?height=280&width=400';

        $target.parent().addClass('active');


        $imagebig.attr('src', url).hide().fadeIn(250);

    });
    

    //retreive related products
    $.getJSON('/data/product/guid/' + encodeURIComponent(WebPage.Data.productGuid) + '/related-products')
        .done((data) => {

            //has related
            if (data.related) {

                //append to options boxs
                var $related = $('<div class="related-container"></div>');
                $('.product-options').append($related);


                var handler = function(products, title) {

                    if (typeof products != 'undefined') {

                        var $color = $('<div class="related color"><div class="imageFrame"><div class="label">' + title + '</div><div class="images"></div></div></div>');

                        $color.on('click', (event: JQueryEventObject) => {
                            event.stopPropagation();

                            //andere dicht  
                            $('.related').removeClass('open');

                            $color.addClass('open');

                            WebPage.References.$body.one('click', () => {
                                $color.removeClass('open');
                            });
                        });

                        var $container = $color.find('.images');

                        for (var x = 0; x < products.length; x++) {
                            var product = products[x];
                            var $img = $('<img src="/image/product/guid/' + encodeURIComponent(product.guid) + '?width=135&height=94" />');
                            $img.attr({ 'title': product.productcode + '\n' + product.description });
                            $img.data('url', product.url);
                            $container.append($img);
                        }

                        $container.find('img').on('click', (event: JQueryEventObject) => {
                            var $this = $(event.target);
                            if ($this.closest('.related.open').length) {
                                
                                location.href = $this.data('url');

                            }
                        });


                        $related.append($color)
                    }
                };

                var matchingString = 'Matching';
                var colorString = 'Color variations';
                var materialString = 'Material variations';
                var alternativeString = 'Alternatives';

                var $html = $('html');

                switch ($html.attr('lang')) {
                    case 'nl':
                        matchingString = 'Bijpassend';
                        colorString = 'Kleur variaties';
                        materialString = 'Materiaal variaties';
                        alternativeString = 'Alternatieven';
                        break;

                    case 'de':
                        matchingString = 'Passender Schmuck';
                        colorString = 'Farbvarianten';
                        materialString = 'Matrialvarianten';
                        alternativeString = 'Alternativen';
                        break;
                }


                handler(data.related["Supplement"], matchingString);
                handler(data.related["Color"], colorString);
                handler(data.related["Material"], materialString);
                handler(data.related["Alternative"], alternativeString);


            }
        

    });
    

})