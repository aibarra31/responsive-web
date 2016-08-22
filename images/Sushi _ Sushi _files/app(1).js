var kona = {
	iScroll:null,
	loadingQueue:null,
	processingQueue:false,
    mapInitialized: false,
	initialPage: $('#c5').data('loaded-page'),
	$activePage: $('.page[data-rel-path="'+$('#c5').data('loaded-page')+'"]'),
	slider:{
		$el:$('#slider'),
		$track:$('#slider .track')
	},
	$slideSplash:null,

	init:function(){
		this.$slideSplash = $('#jSplash').clone();

		if(!this.iScroll && $('#slider').length){
			this.iScroll = new IScroll('#slider', {
				probeType: 3,
				snap:true,
				mouseWheel: false,
				scrollX: true,
				scrollY: false,
				disableMouse:true,
				disablePointer:true,
				disableTouch:true
			});
		}

		this.goToPageByPath($('#c5').data('loaded-page'),0);

        this.functionsInit(this.$activePage.children());

		var $pagesToLoad = $('#c5 .page[data-loaded="0"]');
		if($pagesToLoad.length){
			this.loadPage($pagesToLoad.eq(0).data('cid'),true);
		}
	},

	goToPageByPath:function(path,speed){
		var page = $('#slider .page[data-rel-path="'+path+'"]')[0];

		if(!$(page).length){
			page = $('#slider .page[data-cid="1"]')[0];
		}

		if(!parseInt($(page).attr('data-loaded'))) {
			this.loadingQueue = null;
			this.loadPage($(page).data('cid'));
		}

		if($(page).length) {
			var videoPlayer = document.getElementById('home-video');
			if ($(page).data('cid') == '1') {
				$('#c5').addClass('home');

				if ($(videoPlayer).length) {
					videoPlayer.play();
				}

			} else {
				$('#c5').removeClass('home');
			}

			//make sure all inactive pages are hidden
			$('.page').not('.active').hide();

			this.iScroll.refresh();

			//show selected page
			$(page).show();
			this.iScroll.scrollToElement($('.page.active')[0], 0, false, false, IScroll.utils.ease.circular);

			$('.page.active').removeClass('active');
			$(page).addClass('active');
			this.iScroll.scrollToElement(page, speed, false, false, IScroll.utils.ease.circular);

			$(document).trigger('kona.page-navigated', page);
		}
	},
	loadPage:function(cID,processNext){
		var $page = $('#c5 .page[data-cid="'+cID+'"]');

		if($page.attr('data-loaded') == '1'){
			if(processNext){
				var $pagesToLoad = $('#c5 .page[data-loaded="0"]');
				this.loadPage($pagesToLoad.eq(0).data('cid'),true);
			}

			return false;
		}

        var $slideSplash = this.$slideSplash.clone().addClass('slideSplash').show();

        $page.attr('data-loaded',1).append($slideSplash);

        if (cID !== undefined){
            $.post(CCM_REL+'/index.php/get_page_content', {cID:cID}, $.proxy(function(r){
                $page.attr('data-loaded',1).append($slideSplash);
                $slideSplash.remove();
                var $content = $(r);
                //this.setContentPageHeight($content);
                $page.prepend($content);
                $content.hide();
                $content.fadeIn($.proxy(function(){
                    this.functionsInit($content);
                }, this));

				/*
                if(processNext){
                    var $pagesToLoad = $('#c5 .page[data-loaded="0"]');
                    if ($pagesToLoad.length){
                        this.loadPage($pagesToLoad.eq(0).data('cid'),true);
                    }
                }
                */

                if($('body.apple').length){
                    $page.find('.iframe-block').each(function(){
                        var $parents =  $(this).parent('.overflow-scroll').parents('.col');
                        $(this).find('iframe').hide();
                        $(this).height($(this).closest('.col').outerHeight(true));
                        $(this).find('iframe').show();
                        $(this).parent('.overflow-scroll').css('overflow', 'initial').parents('.col').hide().css('background', '#fff');

                        setTimeout(function(){
                            $parents.fadeIn(400);
                        },500);
                    });
                }

            },this));
        }else{

            this.functionsInit($('body'));
        }

	},
    functionsInit:function($content){
        var isAdminMode = $('.ccm-toolbar-visible').length;
        if (!isAdminMode){
            this.bgSliderInit($content);
        }
        if (this.mapInitialized === false && $('.location-map').length){
            google.maps.event.addDomListener(window, 'load', this.mapInit($content));
        }
        this.setBindings($content);
    },
    bgSliderInit: function($c){
        $c.filter('.background-slider').not('.slick-slider').slick({
            autoplay: true,
            autoplaySpeed: 5000,
            fade: true,
            cssEase: 'linear',
            speed: 1500,
            dots: false,
            arrows: false
        });
    },
    setBindings: function($c){
        if($('body.apple').length){
            $c.find('.iframe-block').each(function(){
                $(this).find('iframe').hide();
                $(this).height($(this).closest('.col').outerHeight(true));
                $(this).find('iframe').show();
            });
        }

		//video modal block
		$c.on('click','.video-modal-block .trigger',function(){
			var $modal = $(this).closest('.video-modal-block').find('.modal-video-wrapper').clone();
            var $iframe = $modal.find('iframe');
            var iframeSrc = $iframe.attr('src');

            $modal.appendTo('body').fadeIn();

            if($iframe.length){
                $iframe.attr('src', iframeSrc+'&autoplay=1')
            } else {
                $modal.find('video')[0].play();
            }

		});
        
        $c.find('select.kg-select2:not(.bound)').addClass('bound').each(function(){
            var self = $(this);
            self.select2({
                allowClear:self.data('allow-clear')
            });
        });

        $c.find('.reservations-select').on('change', function(){
            var $form = $(this).closest('.form-group');
            
            if ($(this).val() !== 'seldefault'){
                var $matchedLocations = $form.find("li.kg-location[data-state='" + $(this).val() +"']");
                $form.find('.cl-label').html($matchedLocations.length > 0 ? "Choose Your Location" : "<span style='color:#CC3300 ;'>Sorry, there are no reservations available in your state.</span>").fadeIn();
                $form.find('li.kg-location').hide();
                $matchedLocations.fadeIn();
            }else{
                $form.find('.cl-label').hide();
                $form.find('li.kg-location').hide();
            }
        });

        $c.find('.online-order-select').on('change', function(){
            var $form = $(this).closest('.form-group');
            if ($(this).val() !== 'seldefault'){
                var $matchedLocations = $form.find("li.kg-location[data-state='" + $(this).val() +"']");
                $form.find('.cl-label').html($matchedLocations.length > 0 ? "Choose Your Location" : "<span style='color:#CC3300 ;'>Sorry, online ordering is not available in this state.</span>").fadeIn();
                $form.find('li.kg-location').hide();
                $matchedLocations.fadeIn();
            }else{
                $form.find('.cl-label').hide();
                $form.find('li.kg-location').hide();
            }
        });



        $c.find('.red-accordion:not(.bound)').addClass('bound').on('click', function(){
            var $colParent = $(this).parents(".overflow-scroll");
            $('.red-accordion').not($(this)).removeClass('closed').addClass('open');
            $(this).toggleClass('open closed');
            $('.red-accordion-body').slideUp();
            if ($(this).hasClass('open')){
                $(this).next('.red-accordion-body').slideToggle();
            }
            $colParent.animate({ scrollTop: $colParent[0].scrollHeight}, 500);
        });

        $c.find('.matchHeight:not(.bound)').addClass('bound').matchHeight();

        $('.ajax-form:not(.bound)').addClass('bound').on('submit', function(e){
            e.preventDefault();
            ajaxFormSubmit($(this));
        });
    },
    mapInit:function($c) {
        var color = "#9E2811";
        var saturation = 100;
        var styles = [
            {
                "featureType": "landscape",
                "stylers": [
                    {"hue": "#000"},
                    {"saturation": -100},
                    {"lightness": 40},
                    {"gamma": 1}
                ]
            },
            {
                "featureType": "road.highway",
                "stylers": [
                    {"hue": color},
                    {"saturation": saturation},
                    {"lightness": 20},
                    {"gamma": 1}
                ]
            },
            {
                "featureType": "road.arterial",
                "stylers": [
                    {"hue": color},
                    {"saturation": saturation},
                    {"lightness": -10},
                    {"gamma": 1}
                ]
            },
            {
                "featureType": "road.local",
                "stylers": [
                    {"hue": color},
                    {"saturation": saturation},
                    {"lightness": 20},
                    {"gamma": 1}
                ]
            },
            {
                "featureType": "water",
                "stylers": [
                    {"hue": "#000"},
                    {"saturation": -100},
                    {"lightness": 15},
                    {"gamma": 1}
                ]
            },
            {
                "featureType": "poi",
                "stylers": [
                    {"hue": "#000"},
                    {"saturation": -100},
                    {"lightness": 25},
                    {"gamma": 1}
                ]
            }
        ];

        var options = {
            styles: styles,
            minZoom: 3,
            scrollwheel:false
        };

        var thisKona = this;
        $c.find(".location-map").each(function() {
            thisKona.createMap({
                $locationsBlock: $(this).closest('.locations-block'),
                map: new google.maps.Map($(this).get(0), options),
                markers: {},
                activeInfoWindow: null,
                bounds: null
            });
        });
    },
    createMap:function (mapObj) {

        mapObj.$locationsBlock.on('click', '.location .title', function () {
            new google.maps.event.trigger(mapObj.markers[$(this).closest('.location').data('id')], 'click');
        });





		mapObj.$locationsBlock.find('.location-search').submit(function (e) {
            e.preventDefault();

            mapObj.bounds = new google.maps.LatLngBounds();

            $.each(mapObj.markers, function (locationId, marker) {
                marker.setMap(null);

            });
            mapObj.markers = {};

            var $block = mapObj.$locationsBlock;
            var $locations = $block.find('.locations');
            var $message = $block.find('.message');

            $locations.empty();
            $message.show().text('Searching...');

            var data = {
                location: $block.find('input[name="location"]').val()
            };

			var geocoder = new google.maps.Geocoder();
			geocoder.geocode( { 'address': $block.find('input[name="location"]').val()}, $.proxy(function(results, status) {
				if(status == google.maps.GeocoderStatus.OK){
					data.lat = results[0].geometry.location.lat();
					data.lng = results[0].geometry.location.lng();
				}


				$.post($(this).attr('action'), data, function (response) {
					response = $.parseJSON(response);

					if (response.success) {
						$.each(response.locations, function () {
							// map
							if (!this.latitude || !this.longitude) {
								//continue equivalent
								return true;
							}

							var directionsLink = 'http://maps.google.com/maps?f=q&hl=en&saddr=current+location&daddr=' + encodeURIComponent(this.address + ' ' + this.city + ' ' + this.state);

							if(!this.title_note){
								this.title_note = '';
							}else{
								this.title_note = this.title_note.toLowerCase().kgEscapeHtml();
							}

							//create info window
							var $infoWindowContent = $("<div>").append([
								$('<h5 class="red-text">').html(this.title.toLowerCase() + '<span class="title-note">'+this.title_note+ '</span>'),
								$("<span>").text(this.address.toLowerCase()),
								$("<br>"),
								$("<span>").text(this.city + ', ' + this.state.toLowerCase() + ' ' + this.zip),
								$("<br>"),
								$("<a>").attr('href', 'tel:' + this.phone_number).text(this.phone_number),
								this.location_page_path ? $("<br>") : '',
								this.location_page_path ? $("<a>").attr('href', this.location_page_path).text('details') : '',
								$("<br>"),
								$("<a>").attr('href', directionsLink).attr('target', '_blank').text('get directions')
							]);

							//create marker
							var marker = new google.maps.Marker({
								map: mapObj.map,
								position: new google.maps.LatLng(this.latitude, this.longitude),
								icon: '/application/themes/kona_grill/img/map-marker-sm.png'
							});

							marker.infoWindow = new google.maps.InfoWindow({
								content: $infoWindowContent.html()
							});

							mapObj.markers[this.id] = marker;

							//extend bounds
							mapObj.bounds.extend(marker.position);

							//bind marker click event
							google.maps.event.addListener(marker, 'click', function () {
								if (mapObj.activeInfoWindow) {
									mapObj.activeInfoWindow.close();
								}

								marker.infoWindow.open(mapObj.map, marker);
								mapObj.activeInfoWindow = marker.infoWindow;

								mapObj.map.setZoom(14);
								mapObj.map.panTo(marker.getPosition());
							});

							// sidebar
							var $li = $("<li>").attr('class', 'location').attr('data-id', this.id);
							var $contentLeft = $("<div>").attr('class', 'col col-3/4 shift5-full padding-xl-r');
							var $contentRight = $("<div>").attr('class', 'col col-1/4 shift5-full text-right');

							$contentLeft.append([
								$("<div>").attr('class', 'title').append([
									$("<i>").attr('class', 'fa fa-map-marker'),
									' ' + this.title.kgEscapeHtml() + ' ' + (this.title_note ? ' <span class="title-note"> - ' +this.title_note + '</span>' : '')
 								]),
								$("<div>").attr('class', 'address').append([
									this.address.kgEscapeHtml(),
									'<br>',
									this.city.kgEscapeHtml() + ', ' + this.state.kgEscapeHtml() + ', ' + this.zip.kgEscapeHtml()
								]),
								$("<div>").attr('class', 'phone').append([
									$("<i>").attr('class', 'fa fa-phone'),
									$("<a>").attr('href', 'tel:' + this.phone_number).attr('target', '_blank').attr('class', 'black-text').text(this.phone_number)
								])
							]);

							if (this.distance) {
								$contentLeft.append($("<div>").attr('class', 'distance').append([
									$("<span>").attr('class', 'red-text').text(Math.round(this.distance * 100) / 100),
									' miles away'
								]));
							}

							if (this.details) {
								$contentLeft.append($("<div>").attr('class', 'details').text(this.details.trim().nl2br()));
							}

							$li.append([
								$contentLeft,
								$contentRight.append([
									$("<a>").attr('class', 'call-to-action').attr('href', directionsLink).attr('target', '_blank').text('google maps'),
									//this.reservation_url ? '<br>' : '',
									this.reservation_url ? $("<a>").attr('href', this.reservation_url).attr('target', '_blank').attr('class', 'call-to-action').text('book a table') : '',
									//'<br>',
									this.location_page_path ? $("<a>").attr('href', CCM_APPLICATION_URL + this.location_page_path).attr('class', 'call-to-action detail-link').text('details') : ''
								]),
								$("<div>").attr('class', 'clear')
							]);

							$locations.append($li);

							if (data.location && Object.keys(mapObj.markers).length == 1) {
								new google.maps.event.trigger(marker, 'click');
							}
						});

						mapObj.map.fitBounds(mapObj.bounds);

						//set zoom if one location is returned (bounds will zoom in on location too far if not set here)
						if (_.size(mapObj.markers) === 1){
							mapObj.map.setZoom(15);
						}
					}

					$message.text(response.message);
				}).fail(function () {
					$message.text('There was an error processing your request, please try again later');
				});
			},this));

            google.maps.event.trigger(mapObj.map, "resize");
        }).submit();

        $(document).on('kona.page-navigated', function (e, page) {
            if ($(page).data('cid') == 157) { // this stinks.. but seems like the least likely thing to break? fix at some point..
                google.maps.event.trigger(mapObj.map, "resize");
                mapObj.map.fitBounds(mapObj.bounds)
            }
        });

        google.maps.event.addListenerOnce(mapObj.map, 'idle', $.proxy(function(){
            this.mapInitialized = true;
        }, this));

        return mapObj;
    }
}

kona.init();

// Bind to StateChange Event
History.Adapter.bind(window,'statechange',function(){ // Note: We are using statechange instead of popstate
    var path = window.location.pathname;
    kona.goToPageByPath(path,400);
});

$(function(){
    $(document).on('click','.modal-video-wrapper i',function(){
        $(this).closest('.modal-video-wrapper').fadeOut(400,function(){
           $(this).remove();
        });
    });

    $(document).on('submit','.location-search',function(){
        if($(this).find('input[name="location"]').val() != ''){
            $(this).closest('.locations-block').find('.locations').show();
        } else {
            $(this).closest('.locations-block').find('.locations').hide();
        }
    });

    $(document).on('mouseenter','.social-nav-block a',function(){
        //do not apply animations to social nav block placed in mobile menu
        if(!$(this).closest('#mobile-menu').length){
            $(this).stop().animate({'background-color':$(this).data('hover-color')},200);
        }
    });

    $(document).on('mouseleave','.social-nav-block a',function(){
        //do not apply animations to social nav block placed in mobile menu
        if(!$(this).closest('#mobile-menu').length){
            $(this).stop().animate({'background-color':'rgba(0,0,0,.8)'},200);
        }
    });

    var videoPlayer = document.getElementById('home-video');
	if($(videoPlayer).length){
		$(videoPlayer).coverVid(1280,720);
		//window.dispatchEvent(new Event('resize'));
	}

    $('#video-toggle').on('click', function(){
        $(this).hasClass('fa-pause') ? videoPlayer.pause() : videoPlayer.play();
        $(this).toggleClass('fa-play fa-pause');
    });

    var isAdminMode = $('.ccm-toolbar-visible').length;

    if (isAdminMode){
        $('.background-slider').not('.slick-slider').slick({
            autoplay: true,
            autoplaySpeed: 5000,
            fade: true,
            cssEase: 'linear',
            speed: 1500,
            dots: false,
            arrows: false
        });
    }

    if($('#slider').length && !isAdminMode) {

        $('#c5').on('click', 'a', function (e) {
            if ($(this).hasClass('nav-disabled')) {
                return false;
            }
            var href = $(this).attr('href').replace('index.php/', '').replace(CCM_APPLICATION_URL, '');
            var $navItem = $('.nav a[href="' + href + '"]');
            var $c5 = $('#c5');
            var $page = $('*[data-rel-path="' + href + '"]');
            var cID = $(this).data('cid');
            $c5.attr('data-cid',cID);
            var isHome = $c5.attr('data-cid') === $c5.attr('data-home-cid');
            var wasHome = $c5.hasClass('home');
            var $ie9 = $('body.ie-9').length;

            if(wasHome && $(videoPlayer).length){
                videoPlayer.pause();
            }

            if ($page.length) {
                if ($page.attr('data-loaded') == '0') {
                    kona.loadPage($page.data('cid'),true);
                }
            }

            //toggle selected class
            $('.nav').find('.nav-selected').removeClass('nav-selected').removeClass('nav-path-selected');
            $(this).addClass('nav-selected').parent('li').addClass('nav-selected');

            if ($page.length && !$ie9) {
                e.preventDefault();
                var title = $('#c5').data('site-name')+' :: '+$page.data('page-name');
                var relPath = $page.data('rel-path');
                History.pushState({state:1},title,relPath);
            }

            $('#footer-cr').remove();
        });

        var $splashPage = $('#jSplash').clone();
        var splashTimeout = null;
        var windowWidth = $(window).width();
        $(window).resize(function(){
            clearTimeout(splashTimeout);
            splashTimeout = setTimeout(function () {
                var path = window.location.pathname;
                if(path && path != CCM_REL){
                    kona.goToPageByPath(path,0);
                }
                $('#jSplash').fadeOut(400);
            }, 400);

            //do not show preloader if only resized vertically
            if ($(window).width() === windowWidth) return;
            windowWidth = $(window).width();

            if (!$('#jSplash').is(':visible')){
                if ($('#jSplash')){
                    $('body').prepend($splashPage);
                }
                $('#jSplash').show();
            }
        });
    }

	if ($(videoPlayer).length){
		$("body").jpreLoader({
			splashID:"#jSplash",
			showPercentage:!0,
			autoClose:!0,
			showSplash: true,
			splashFunction:function(){
				if ($(videoPlayer).length){
					$("#circle").animate({opacity:1},700,"linear");
					videoPlayer.play();
				}
			}
		});
	}else{
		$('#jSplash').hide();
	}

    $('input[name="kona"]').parent().addClass('kona-sp-field');

    $('.iframe-block').parent('.overflow-scroll').css('overflow', 'initial').parents('.col').css('background', '#fff');
});

function ajaxFormSubmit($form){
    var data = $form.serializeArray();
    data.push({name: "ajax", value: true});
    $.ajax({
        url: $form.attr('action'),
        type: 'POST',
        data: $.param(data),
        dataType: 'json',
        beforeSend: function() {
            $form.find('.fa-spin').show();
            $(".ajax-errors, .ajax-success").hide();
        },
        complete: function() {
            $form.find('.fa-spin').hide();
        },
        success: function(result){
            if (!result.errors && result.success){
                $form.children('.ajax-success').show().text(result.msg);
                $form.find('input, textarea').not('input[name^=qsID]').val('');
            }else{
                $form.children('.ajax-errors').empty().text('Please correct the following errors:');
                $.each(result.errors, function(key,msg) {
                    $form.children('.ajax-errors').show().append('<div class="error">'+ msg +'</div>');
                });
            }
        },
        error: function(result){
            $form.children('.ajax-errors').show().empty().append('<div class="error">Something went wrong, please try again.</div>');
        }
    });
}