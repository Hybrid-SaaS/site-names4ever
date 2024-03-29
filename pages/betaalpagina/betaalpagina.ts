/// <reference path="../../definition/jquery.d.ts" />

declare var ga: any;
declare var beslistQueue: any;

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

$.getJSON('/data/order/' + getParameterByName('order') + '/' + getParameterByName('hash'))
    .done((data) => {
        ga('require', 'ecommerce', 'ecommerce.js');

        ga('ecommerce:addTransaction', {
            id: data.orderNumber,
            affiliation: 'Names4Ever',
            revenue: data.totalExcludingVat.toFixed(2),
            shipping: '0',
            tax: data.totalVat.toFixed(2)
        });

        var orderdata = [];
        for (var x = 0; x < data.orderLines.length; x++) {
            var orderLine = data.orderLines[x];
            ga('ecommerce:addItem', {
                id: data.orderNumber, // order ID � VERPLICHT
                sku: orderLine.productCode, // SKU/code � VERPLICHT
                name: orderLine.description, // Productnaam
                category: '', // Categorie
                price: orderLine.priceIncludingVat.toFixed(2), // Stukprijs - VERPLICHT (Geen euroteken meegeven)
                quantity: orderLine.amount // Aantal - VERPLICHT
            });

            orderdata.push([orderLine.productCode, orderLine.amount, orderLine.priceIncludingVat]);
        }
        ga('ecommerce:send');

    });