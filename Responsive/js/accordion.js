$(document).ready(function () {
    function close_accordion_section() {
        $('.list-group .list-group-title').removeClass('active');
        $('.list-group .list-group-content').slideUp(300).removeClass('open');
    }

    $('.list-group-title').click(function (e) {
        // Grab current anchor value
        var currentAttrValue = $(this).attr('href');

        if ($(e.target).is('.active')) {
            close_accordion_section();
        } else {
            close_accordion_section();

            // Add active class to section title
            $(this).addClass('active');
            // Open up the hidden content panel
            $('.accordion ' + currentAttrValue).slideDown(300).addClass('open');
        }

        e.preventDefault();
    });
});