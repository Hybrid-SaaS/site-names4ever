$(function () {
	//small to big
	var $smallImages = $('.smallimage');
	var $smallImagesFrames = $('.product-image-rest .imageFrame');
                        
	$smallImages.click(function (event) {
		$smallImagesFrames.removeClass('active');
                        
		var $imagebig = $('#imagebig');
		var $target = $(event.target);
		var url = '/image/product/guid/' + encodeURIComponent($imagebig.data('guid')) + '/' + $target.data('index');
                        
		$target.parent().addClass('active');
                        
		$imagebig.attr('src', url).show();
	});
});
