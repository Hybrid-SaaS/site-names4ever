$(document).ready(function () {
    // ACCORDION FUNCTIE
    $('.accordion-toggle').click(function (e) {
        // Grab current anchor value
        var currentAttrValue = $(this).attr('href');

        if ($(e.target).is('.active')) {
            $(this).removeClass('active');
            $(currentAttrValue).slideUp(300).removeClass('open');
        } else {
            // Add active class to section title
            $(this).addClass('active');
            // Open up the hidden content panel
            $(currentAttrValue).slideDown(300).addClass('open');
        }

        e.preventDefault();
    });
});