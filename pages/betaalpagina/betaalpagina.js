/// <reference path="../../definition/jquery.d.ts" />

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"), results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

$.getJSON('/data/order/' + getParameterByName('order') + '/' + getParameterByName('hash')).done(function (data) {
    ga('require', 'ecommerce', 'ecommerce.js');
	
	ga('ecommerce:addTransaction', {
		id: data.orderNumber,
		affiliation: 'Names4Ever',
		revenue: data.totalExcludingVat.toFixed(2),
		shipping: '0',
		tax: data.totalVat.toFixed(2)
	});
	
    for (var x = 0; x < data.orderLines.length; x++) {
        var orderLine = data.orderLines[x];
        ga('ecommerce:addItem', {
            id: data.orderNumber,
            sku: orderLine.productCode,
            name: orderLine.description,
            category: '',
            price: orderLine.priceExcludingVat.toFixed(2),
            quantity: orderLine.amount.toFixed(0)
        });
    }
    ga('ecommerce:send');
	
	// Beslist Nederland
	 var beslistQueue = [];
	 beslistQueue.push(['setShopId', '3JHCC39SN']);
	 beslistQueue.push(['cps', 'setTestmode', false]);
	 beslistQueue.push(['cps', 'setTransactionId', data.orderNumber]);
	 beslistQueue.push(['cps', 'setOrdersum', data.totalIncludingVat]);
	 beslistQueue.push(['cps', 'setOrderCosts', 0.00]);
      for (var x = 0; x < data.orderLines.length; x++) {
        var orderLine = data.orderLines[x];
			 beslistQueue.push(['cps', 'setOrderProducts',[
			 [orderLine.productCode, orderLine.amount, orderLine.priceIncludingVat]
			 ]]);
	  }
	
	 beslistQueue.push(['cps', 'trackSale']);
	 (function () {
	 var ba = document.createElement('script');
	 ba.async = true;
	 ba.src = '//pt1.beslist.nl/pt.js';
	 var s = document.getElementsByTagName('script')[0];
	 s.parentNode.insertBefore(ba, s);
	 })();	
	
});
