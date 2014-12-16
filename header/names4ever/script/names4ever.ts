/// <reference path="../../../definition/jquery.d.ts" />

module WebPage {
    export module References {
        export module MessageBox {
            export var $messageLayer: JQuery;
            export var $message: JQuery;

            export var $messageHeader: JQuery;
            export var $messageBody: JQuery;
        }

        export var $document: JQuery;
        export var $html: JQuery;
        export var $body: JQuery;
    }

    export module Data {
        export var language: string;
        export var country: string;
        export var productGuid: string;
        export var basketGuid: string;
    }



    export class Event {
        public eventType: EventType;
        public data: any;
        constructor(eventType: EventType, data: any) {
            this.eventType = eventType;
            this.data = data;
        }
    }

    export enum EventType {
        BeforeLoad,
        Load
    }
    export module Events {
        export module Handlers {
            export var onBeforeLoad: Function[] = [];
            export var onLoad: Function[] = [];
        }


        export function fire(eventType: EventType, data: any = null) {

            var handlers = getHandlers(eventType);
            for (var x = 0; x < handlers.length; x++) {
                handlers[x].call(new Event(eventType, data));
            }
        }

        function getHandlers(eventType: EventType): Function[] {
            switch (eventType) {
                case EventType.Load:
                    return Handlers.onLoad;
                case EventType.BeforeLoad:
                    return Handlers.onBeforeLoad;
            }
            return null;
        }

        export function on(eventType: EventType, handler: Function) {
            getHandlers(eventType).push(handler);
        }
    }


    //wil be overridden
    export function resourceString(name: string): string {
        return 'no translation: ' + name;
    }
    //init the page (onload)
    export function load(): void {

        Events.fire(EventType.BeforeLoad);

        References.$document = $(document);
        References.$html = $('html');
        References.$body = $(document.body);

        //set language
        Data.language = References.$html.attr('lang');
        Data.country = References.$html.data('country');

        //init basket
        Basket.init();

        //verplichte velden
        $('.required').change((event) => {
            var $this = $(event.target);

            if ($this.val().length) {
                $this.addClass('ok');
            } else {
                $this.removeClass('ok');
            }

        });

        Events.fire(EventType.Load);
    }

    export module Basket {
        export module References {
            export var $basket: JQuery;
            export var $amount: JQuery;
            export var $total: JQuery;
        }

        export module Events {
            export var onChange: Function;
        }

        export function init(): void {
            References.$basket = $('#shoppingCart');
            References.$amount = $('#shoppingcart_amount');
            References.$total = $('#shoppingcart_total');

            updateClient(true);
        }

        export function updateClient(init: boolean = false) {
            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: '/Website/Basket/Update-client',
                cache: false
            })
                .done(data => {

                    if (Events.onChange) {
                        var result = Events.onChange.call(this, data);
                        if (result === false)
                            return;
                    }

                    References.$total.text(data.total);
                    References.$amount.text(data.count);

                    if (!init) {
                        $('.basket-total').text(data.total);
                        $('.basket-total-incl').text(data.totalIncl);
                        $('.basket-total-excl').text(data.totalExcl);
                    }
                });
        }

        export function updateAmount(id: string, amount: number, callBack: Function = null) {
            var data = {};
            data["property"] = 'amount';
            data["id"] = id;
            data["amount"] = amount;

            $.ajax({
                type: 'POST',
                data: data,
                dataType: 'json',
                url: '/Website/Basket/Update',
                cache: false
            }).done((result) => {

                    if (callBack != null) {
                        callBack.call(this, result);
                    }

                    updateClient();
                });
        }

        export function remove(id: string) {
            var data = {};
            data["property"] = 'remove';
            data["id"] = id;

            $.ajax({
                type: 'POST',
                data: data,
                dataType: 'text',
                url: '/Website/Basket/Update',
                cache: false
            }).done(() => updateClient());
        }
    }

    export module Message {
        export enum MessageType {
            Information,
            Warning,
            Success,
            Error
        }

        export class Settings {
            public body: string;
            public header: string;
            public type: MessageType = MessageType.Information;

        }

        export function show(messagesettings: Settings, callbackFunction: Function = null) {

            if (!References.MessageBox.$messageLayer) {
                References.MessageBox.$messageLayer = $('<div id="message-container"><div class="message">' +
                    '<div class="message-header"></div>' +
                    '<div class="message-body"></div>' +
                    '</div></div>');

                References.MessageBox.$messageLayer.appendTo(References.$body);
                References.MessageBox.$message = References.MessageBox.$messageLayer.find('.message');
                References.MessageBox.$messageHeader = References.MessageBox.$message.find('.message-header');
                References.MessageBox.$messageBody = References.MessageBox.$message.find('.message-body');

                References.MessageBox.$messageLayer.bind('click', () => {
                    References.MessageBox.$message.animate({ 'top': '150%' }, 200, function () {

                        References.MessageBox.$messageLayer.fadeOut(200);

                        if (callbackFunction != null) {
                            callbackFunction.call(this);
                        }

                    });

                });
            }

            References.MessageBox.$messageLayer.focus();
            setTimeout(() => {
                References.MessageBox.$messageLayer.trigger('click');
            }, 2500);


            References.MessageBox.$messageHeader.text(messagesettings.header);
            References.MessageBox.$messageBody.text(messagesettings.body);
            References.MessageBox.$message.removeClass();
            switch (messagesettings.type) {
                case MessageType.Error:
                    References.MessageBox.$message.addClass('message error');
                    break;
                case MessageType.Success:
                    References.MessageBox.$message.addClass('message success');
                    break;
                case MessageType.Warning:
                    References.MessageBox.$message.addClass('message erwarningror');
                    break;
                default:
                    References.MessageBox.$message.addClass('message info');
                    break;
            }

            References.MessageBox.$messageLayer.fadeIn(200);
            var $window = $(window);
            var top = Math.abs((($window.height() - References.MessageBox.$message.outerHeight()) / 2));
            //top = $window.scrollTop();
            References.MessageBox.$message.css('top', 0).animate({ 'top': top }, 200);
        }
    }
}

//Load website
$(() => WebPage.load());

//onload
$(function () {


    $.getScript("/Website/JScript/language-strings");

    //verplaats menus naar juiste element
    $('#bottommenu').children().appendTo($('#menulocation'));
    $('#bottommenu2').children().appendTo($('#menulocation2'));

    //link naar shoppingcart
    $('#shoppingCart').click(function () {
        document.location.href = "/Website/Pages/Basket";
    });
    
    var $shopText = $('#shoppingcart_text');
    WebPage.Basket.Events.onChange = function (data)
    {
        if (data.count == 1)
            $shopText.hide();
        else
            $shopText.show();
    }


	//alleen bij de checkout pagina
    var $checkout = $('.checkout');
    if ($checkout.length == 1) {

		//zoek alle payment methods
		var $payments = $('.paymentmethods');
		var $paymentmethods = $('.paymentmethod');
		 $paymentmethods.hide();

        if (WebPage.Data.country == 'nl') {
            $paymentmethods.filter('.account').show();
            $paymentmethods.filter('.manual').show();
        }

		var p = $paymentmethods.first();
		switch (WebPage.Data.country) {
			case 'nl':
				p.before($paymentmethods.filter('.ideal').show())
				p.before($paymentmethods.filter('.mastercard').show());
				p.before($paymentmethods.filter('.paypal').show());
				p.before($paymentmethods.filter('.visa').show());
				p.before($paymentmethods.filter('.maestro').show());
				p.before($paymentmethods.filter('.americanexpress').show());
				p.before($paymentmethods.filter('.kbconline').show());
				p.before($paymentmethods.filter('.bankcontactmrcash').show());
				p.before($paymentmethods.filter('.cbconline').show());
				p.before($paymentmethods.filter('.belfius').show());
				break;
			case 'be':
				p.before($paymentmethods.filter('.mastercard').show());
				p.before($paymentmethods.filter('.bankcontactmrcash').show());
				p.before($paymentmethods.filter('.paypal').show());
				p.before($paymentmethods.filter('.visa').show());
				p.before($paymentmethods.filter('.kbconline').show());
				p.before($paymentmethods.filter('.maestro').show());
				p.before($paymentmethods.filter('.americanexpress').show());
				p.before($paymentmethods.filter('.cbconline').show());
				break;
	    	case 'de':
				p.before($paymentmethods.filter('.mastercard').show());
				p.before($paymentmethods.filter('.sofortuberweisungde').show());
				p.before($paymentmethods.filter('.paypal').show());
				p.before($paymentmethods.filter('.manual').show());
				p.before($paymentmethods.filter('.giropay').show());
				p.before($paymentmethods.filter('.maestro').show());
				p.before($paymentmethods.filter('.visa').show());
				p.before($paymentmethods.filter('.americanexpress').show());
                break;
            case 'at':
                p.before($paymentmethods.filter('.mastercard').show());
                p.before($paymentmethods.filter('.sofortuberweisungde').show());
                p.before($paymentmethods.filter('.paypal').show());
                p.before($paymentmethods.filter('.manual').show());
                p.before($paymentmethods.filter('.giropay').show());
                p.before($paymentmethods.filter('.maestro').show());
                p.before($paymentmethods.filter('.visa').show());
                p.before($paymentmethods.filter('.americanexpress').show());
                break;
            case 'ch':
                p.before($paymentmethods.filter('.mastercard').show());
                p.before($paymentmethods.filter('.sofortuberweisungde').show());
                p.before($paymentmethods.filter('.paypal').show());
                p.before($paymentmethods.filter('.manual').show());
                p.before($paymentmethods.filter('.giropay').show());
                p.before($paymentmethods.filter('.maestro').show());
                p.before($paymentmethods.filter('.visa').show());
                p.before($paymentmethods.filter('.americanexpress').show());
                break;
			case 'gb':
				p.before($paymentmethods.filter('.visa').show());
				p.before($paymentmethods.filter('.mastercard').show());
				p.before($paymentmethods.filter('.americanexpress').show());
				p.before($paymentmethods.filter('.paypal').show());
				p.before($paymentmethods.filter('.maestro').show());
                break;
        }

	    var labelMore = '';
	    switch (WebPage.Data.country) {
	    	case 'nl':
			    labelMore = 'Toon meer betaalmethodes';
			    break;

	    	case 'de':
	    		labelMore = 'Zeige mehr Zahlungsmethoden';
                break;

            case 'at':
                labelMore = 'Zeige mehr Zahlungsmethoden';
                break;

            case 'ch':
                labelMore = 'Zeige mehr Zahlungsmethoden';
                break;

	    	default:
	    		labelMore = 'Show more paymentmethods';
	    		break;
    	}


	    var $newElement = $('<span class="morepaymentmethods" style="cursor: pointer; display: block; margin-top: 20px"></span>').text(labelMore).click( function() {

	    	$paymentmethods.fadeIn(1000);
		    $(this).remove();

	    } );

	    $('#placeorder').before($newElement);
	    if (WebPage.Data.country == 'de') {
		    var avcontent = '<input id="tc" type="checkbox" name="tc"></input>Ich habe die <a target="_blank" href="//names4ever.azurewebsites.net/documents/algemene-voorwaarden/de/agb.pdf">AGB</a> und mein <a target="_blank" href="//names4ever.azurewebsites.net/documents/algemene-voorwaarden/de/widerrufsrecht.pdf">Widerrufsrecht</a> gelesen und akzeptiere diese';
		    $('.input-row .input-label #tc').parent().html(avcontent);
        }
        if (WebPage.Data.country == 'at') {
            var avcontent = '<input id="tc" type="checkbox" name="tc"></input>Ich habe die <a target="_blank" href="//names4ever.azurewebsites.net/documents/algemene-voorwaarden/de/agb.pdf">AGB</a> und mein <a target="_blank" href="//names4ever.azurewebsites.net/documents/algemene-voorwaarden/de/widerrufsrecht.pdf">Widerrufsrecht</a> gelesen und akzeptiere diese';
            $('.input-row .input-label #tc').parent().html(avcontent);
        }
        if (WebPage.Data.country == 'ch') {
            var avcontent = '<input id="tc" type="checkbox" name="tc"></input>Ich habe die <a target="_blank" href="//names4ever.azurewebsites.net/documents/algemene-voorwaarden/de/agb.pdf">AGB</a> und mein <a target="_blank" href="//names4ever.azurewebsites.net/documents/algemene-voorwaarden/de/widerrufsrecht.pdf">Widerrufsrecht</a> gelesen und akzeptiere diese';
            $('.input-row .input-label #tc').parent().html(avcontent);
        }
	    //paymentmethods.append()
    }

    var $flags = $('.flag');

    //verberg vlag voor huidige taal
    for (var x = 0; x < $flags.length; x++) {
        var $flag = $flags.eq(x);
        if ($flag.data('flag') == WebPage.Data.country)
			$flag.hide();

		if ($flag.data('flag') == 'en' && WebPage.Data.country == 'gb')
			$flag.hide();
    }

    var webData = <any>WebPage.Data;
    $('.flag').on('click', (event: JQueryEventObject) => {

        var $flag = $(event.target);
        if (webData.productGuid) {

            switch ($flag.data('flag')) {
                case 'nl':
                    location.href = 'https://www.names4ever.nl/product/' + webData.productGuid;
					return;
				case 'be':
					location.href = 'https://www.names4ever.be/product/' + webData.productGuid;
					return;
                case 'de':
                    location.href = 'https://www.namesforever.de/product/' + webData.productGuid;
					return;
				case 'at':
					location.href = 'https://www.names4ever.at/product/' + webData.productGuid;
					return;
				case 'ch':
					location.href = 'https://www.names4ever.ch/product/' + webData.productGuid;
					return;
                case 'en':
                    location.href = 'https://www.names4ever.co.uk/product/' + webData.productGuid;
					return;
            }
        }


        switch ($flag.data('flag')) {
			case 'nl':
				location.href = 'https://www.names4ever.nl/';
				return;
			case 'be':
				location.href = 'https://www.names4ever.be/';
				return;
			case 'de':
				location.href = 'https://www.namesforever.de/';
				return;
			case 'at':
				location.href = 'https://www.names4ever.at/';
				return;
			case 'ch':
				location.href = 'https://www.names4ever.ch/';
				return;
			case 'en':
				location.href = 'https://www.names4ever.co.uk/';
				return;
        }

    });


    if (WebPage.Data.productGuid) {

            $('#submit').click((event) => {
                event.preventDefault();
                var data = {
                    basketId: WebPage.Data.basketGuid,
                    product: WebPage.Data.productGuid,
                    remark: $('#remark').val(),
                    amount: 1
                };

                var $extension = $('.extension');
                if ($extension.length > 0) {
                    var $set = null;
                    for (var x = 0; x < $extension.length; x++) {
                        var $element = $extension.eq(x);
                        if ($element.attr('id') != 'remark') {
                            if ($element.hasClass('inputrequired')) {
                                if ($element.val().length == 0) {
                                    if (!$set) {
                                        $set = $element;
                                    }
                                    $element.addClass('missing');
                                } else {
                                    $element.removeClass('missing');
                                }
                            }

                            data["extension:" + $element.attr('id')] = $element.val();
                        }
                    }
                }
                if ($set) {
                    //not complete, abort
                    var msg = new WebPage.Message.Settings();
                    msg.type = WebPage.Message.MessageType.Error;
                    msg.body = WebPage.resourceString('BasketNotAllRequiredFieldsFilled');
                    msg.header = WebPage.resourceString('Basket');
                    WebPage.Message.show(msg, () => {
                        $set.focus();
                    });

                    return;
                }

                $.ajax({
                    type: 'POST',
                    url: '/Website/Basket/Add',
                    cache: false,
                    data: data
                })
                    .done(() => {
                        WebPage.Basket.updateClient();
                        location.href = "/Website/Pages/Basket";
                    })
                    .fail(() => {
                        msg = new WebPage.Message.Settings();
                        msg.type = WebPage.Message.MessageType.Error;
                        msg.body = WebPage.resourceString('BasketAddError');
                        msg.header = WebPage.resourceString('Basket');

                        WebPage.Message.show(msg);
                    })
                    .always(() => { });
            });
	};

	$('#newsletter').append('<input class="ph" type="text" value="e-mail" id="newsletter_input" style="display: inline; width: 140px; font-size: 14px; font-style: italic; color: #888;"></input><input type="button" id="mailBtn" value="Ok" style="display: inline; height: 22px; margin-left: 5px; top: -1px; position: relative; font-size: 12px;"></input><span id="doneMsg" style="float: left; color: red; font-size: 12px;"></span>')
		.on('focusin', "#newsletter_input", function() {
			var styles = {
				fontStyle: "normal",
				color: "black"
			};
			if ($(this).hasClass('ph')) {
				$(this).val('').css(styles);
			}
		})
		.on('focusout', "#newsletter_input", function() {
			if (!$(this).val()) {
				var styles = {
					fontStyle: "italic",
					color: "#888"
				};
				$(this).addClass('ph');
				$(this).val('e-mail').css(styles);
			} else {
				$(this).removeClass('ph');
			}
		})
		.on('click', "#mailBtn", function () {
			var mail = $('#newsletter_input').val();
			if (isValidEmailAddress(mail)) {
				$.ajax({
					type: "POST",
					url: "test.html",
					data: {
						mail: $('#newsletter_input').val()
					}
				}).done(function () {
					$('#doneMsg').text('');
					$('#doneMsg').text('Ingeschreven voor de nieuwsbrief');
				}).fail(function () {
					$('#doneMsg').text('');
					$('#doneMsg').text('Fout bij het inschrijven');
				});
			} else {
				$('#doneMsg').text('');
				$('#doneMsg').text('Fout bij het inschrijven');
			}
	});

	function isValidEmailAddress(emailAddress) {
		var sQtext = '[^\\x0d\\x22\\x5c\\x80-\\xff]';
		var sDtext = '[^\\x0d\\x5b-\\x5d\\x80-\\xff]';
		var sAtom = '[^\\x00-\\x20\\x22\\x28\\x29\\x2c\\x2e\\x3a-\\x3c\\x3e\\x40\\x5b-\\x5d\\x7f-\\xff]+';
		var sQuotedPair = '\\x5c[\\x00-\\x7f]';
		var sDomainLiteral = '\\x5b(' + sDtext + '|' + sQuotedPair + ')*\\x5d';
		var sQuotedString = '\\x22(' + sQtext + '|' + sQuotedPair + ')*\\x22';
		var sDomainRef = sAtom;
		var sSubDomain = '(' + sDomainRef + '|' + sDomainLiteral + ')';
		var sWord = '(' + sAtom + '|' + sQuotedString + ')';
		var sDomain = sSubDomain + '(\\x2e' + sSubDomain + ')*';
		var sLocalPart = sWord + '(\\x2e' + sWord + ')*';
		var sAddrSpec = sLocalPart + '\\x40' + sDomain; // complete RFC822 email address spec
		var sValidEmail = '^' + sAddrSpec + '$'; // as whole string

		var reValidEmail = new RegExp(sValidEmail);

		return reValidEmail.test(emailAddress);
	};

});
