$(document).ready(function(){
	$toggle = $('#mobile-menu .toggle');
	var $wrap = $('#site-wrap');
	var $menu = $toggle.closest('#mobile-menu');
	var maxWidth = parseInt($menu.css('max-width'));

	$toggle.click(function(){
		var status = $(this).attr('data-status');

		if(status == 'open'){
			closeNav();
		}else{
			openNav();
		}
	});

	function closeNav(){
		$toggle.attr('data-status','closed');
		$menu.animate({right:'100%'},200);
	}

	function openNav(){
		var x = $toggle.attr('data-openTo');
		var ww = $(window).width();
		var xPixels = ww * (x / 100);

		if(xPixels > maxWidth){
			xPixels = maxWidth;
		}

		$toggle.attr('data-status','open');
		$menu.css('right','100%').animate({right:((ww - xPixels)/ww) * 100+ '%'},200);
	}

	$(window).resize(function(){
		if($toggle.attr('data-status') === 'open'){
			var x = $toggle.attr('data-openTo');
			var ww = $(window).width();
			var xPixels = ww * (x / 100);

			if(xPixels > maxWidth){
				xPixels = maxWidth;
			}

			$menu.css({right:ww - xPixels},200);
		}
	});

    $('#mobile-menu a').on('click', function(){ closeNav(); });

	$('#mobile-menu .nav i').on('click', function(){
		var $minusSign = $('#mobile-menu .nav i.fa-minus');
		var dropDownWrapper = '.dropdown-wrapper';
		var fontAwesome = 'fa-plus fa-minus';
		var minusNotThis = $minusSign.not($(this))

		//if font awesome icons have a class of fa-minus (not including $this) and the closest ul does not have a class of dll-1
		if($(dropDownWrapper).siblings('i').not($(this)).hasClass('fa-minus') && !$(this).closest('ul').hasClass('dll-1')){
			minusNotThis.siblings(dropDownWrapper).slideUp();
			minusNotThis.toggleClass(fontAwesome);
		}

		$(this).toggleClass(fontAwesome);
		$(this).siblings(dropDownWrapper).slideToggle();
	});
});