/// <reference path="../../definition/jquery.d.ts" />


(() => {
    if (WebPage.Data.country == 'at | ch') {
        $('#brandname-footer span').replaceWith('<span>Names4ever</span>');
    }
});