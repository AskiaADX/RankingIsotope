(function ($) {
	"use strict";

	function setMin(count, min){
		var nextButton = document.querySelector("input[name='Next']");

		if (min > 0){
			nextButton.disabled = true;
			nextButton.classList.add('disabled');
			nextButton.classList.add('secondary');
		}
		if (count >= min) {
			nextButton.disabled = false;
			nextButton.classList.remove('disabled');
			nextButton.classList.remove('secondary');
		} else {
			nextButton.disabled = true;
			nextButton.classList.add('disabled');
			nextButton.classList.add('secondary');
		}
	}

	// Polyfill: Add a getElementsByClassName function IE < 9
    function polyfillGetElementsByClassName() {
        if (!document.getElementsByClassName) {
            document.getElementsByClassName = function(search) {
                var d = document, elements, pattern, i, results = [];
                if (d.querySelectorAll) { // IE8
                    return d.querySelectorAll("." + search);
                }
                if (d.evaluate) { // IE6, IE7
                    pattern = ".//*[contains(concat(' ', @class, ' '), ' " + search + " ')]";
                    elements = d.evaluate(pattern, d, null, 0, null);
                    while ((i = elements.iterateNext())) {
                        results.push(i);
                    }
                } else {
                    elements = d.getElementsByTagName("*");
                    pattern = new RegExp("(^|\\s)" + search + "(\\s|$)");
                    for (var j = 0, l = elements.length; j < l; j++) {
                        if ( pattern.test(elements[j].className) ) {
                            results.push(elements[j]);
                        }
                    }
                }
                return results;
            };
        }
	}

	$.fn.adcRanking = function adcRanking(options) {

		// MS: Syntax to set the default value or use the one specified
        (options.instanceId = options.instanceId || 1);
		(options.width = options.width || "auto");
		(options.height = options.height || "auto");
		(options.setMax = options.setMax || $(this).children('.statement').length);
		(options.setMin = options.setMin || 0);
        (options.currentQuestion = options.currentQuestion || '');

				setMin(0,options.setMin);

		var otherQIDarray = options.otherQID.split(","),
			otherRIDarray = options.otherRID.split(",");

		$(this).css({'max-width':options.maxWidth,'width':options.controlWidth});
		$(this).parents('.controlContainer').css({'width':'100%','overflow':'hidden'});

		if ( options.controlAlign === "center" ) {
			$(this).parents('.controlContainer').css({'text-align':'center'});
			$(this).css({'margin':'0px auto'});
		} else if ( options.controlAlign === "right" ) {
			$(this).css({'margin':'0 0 0 auto'});
		}

		var dkActivated = options.dkActivated;
		var animatedResponses = options.animatedResponses;
		var layout = options.layout;
		var dkselected = false;

		// Other
		$(this).parents('.controlContainer').find('.statement .otherText').width( $(this).find('.statement').innerWidth() - 30 ).hide();

		var i;
		for (i = 0; i < otherQIDarray.length; ++i) {
			if ( otherQIDarray[i] ) {
				if ( $( '#'+otherQIDarray[i] ).val() !== '' )
					$(this).parents('.controlContainer').find('.statement[data-index="'+otherRIDarray[i]+'"] .otherText').val( $( '#'+otherQIDarray[i] ).val()).show();
				$( '#'+otherQIDarray[i] ).hide();
			}
		}

		// List of items collection of object {caption : 'The caption', element : jQueryObject}
		var $container = $(this),
			items = options.items,
			showRankMoveControls = Boolean(options.showRankMoveControls),
			rankCount = 0,				// Number of ranked items
			istopeOptions = {			// Isotope options
				itemSelector: '.statement',
				layoutMode: options.layout,
				getSortData: {
					rank: function(elem) {
						var index = $(elem).data('index'),
							item = items[index];
						return parseInt(item.element.val(), 10) || 999;
					}
				},
				sortBy: 'rank'
			},
			total_images = $container.find("img").length,
			images_loaded = 0;

			polyfillGetElementsByClassName();
			var container = document.getElementById("adc_" + options.instanceId);
			var otherTextItems =  [].slice.call(container.getElementsByClassName('otherText'));

			for ( i=0; i<otherTextItems.length; i++ ) {
            otherTextItems[i].onclick = function(e) {
				e.stopPropagation();
			};
			addEvent(otherTextItems[i], 'input',
                         (function (passedInElement) {
                    return function (e) {
                        onInputSemiOpen(e, passedInElement);
                    };
                }(this)));
        }

		 function addEvent(el, type, handler) {
            if (el.attachEvent) el.attachEvent('on'+type, handler); else el.addEventListener(type, handler);
        }

    function myTrim(x) {
        return x.trim();
      }

  function onInputSemiOpen (event, that) {
    var el = event.target || event.srcElement;
    if (el.className === 'otherText') {
        el.previousElementSibling.value = myTrim(el.value);
    }
}


		// Select a statement
		// @this = target node
		function selectStatement(e) {

			if ( !$(e.target).hasClass('upRank') && !$(e.target).hasClass('downRank') ) {

				var $target = $(this),
					index	= $target.data('index'),
					$input = items[index].element,
					value	= parseInt($input.val(), 10);

				if (!value) { // item is currently UNranked
					if (((index+1) == items.length && (dkActivated == 1 || dkActivated == 2)) || ((index+1) == (items.length - 1) && dkActivated == 2)) {
						deselectAllStatements();
						dkselected = true;

						if ((rankCount + 1) <= options.setMax) {
							rankCount += 1;
							$input.val(rankCount);

							$target.addClass('ranked') // Add ranked class
								.find('.rank_text').html(''); // Add rank value

							$(this).parents('.controlContainer').find('.otherText').val('');
							$(this).parents('.controlContainer').find('.otherHidden').val('');
							for (i = 0; i < otherQIDarray.length; ++i) {
								if(otherQIDarray[i]) $( '#'+otherQIDarray[i] ).val('');
							}
							$(this).parents('.controlContainer').find('.otherText').hide();

						}
					} else {
						if (dkselected){
							deselectAllStatements();
						}
						if ((rankCount + 1) <= options.setMax) {
							rankCount += 1;
							$input.val(rankCount);

							$target.addClass('ranked')                // Add ranked class
								.find('.rank_text').html(rankCount); // Add rank value

							var otherID = $.inArray( String(parseInt($(this).attr('data-index'))), otherRIDarray );
							if ( $.inArray( String(parseInt($(this).attr('data-index'))), otherRIDarray ) != -1 )
								$(this).find('.otherText').show().trigger('focus');
						}
					}

					if (!$target.hasClass('ns')) {
						setMin(rankCount, options.setMin);
					} else {
						setMin(0, 0);
					}

				} else { // item is currently ranked

					rankCount -= 1;
					$input.val("");

					$target.removeClass('ranked')           // Remove ranked class
						.find('.rank_text').html(''); // Remove rank value

					// Rerank other items
					$container.find('.statement').each(function() {
						var $current = $(this),
							currentItem  = items[$current.data('index')],
							currentValue = parseInt(currentItem.element.val(), 10);

						if ($current !== $target && currentValue && currentValue > value) {
							// Re-number item
							currentItem.element.val(currentValue - 1);
							$current.find('.rank_text').html(currentValue - 1);
						}

					});

					if ( $.inArray( String(parseInt($(this).attr('data-index'))), otherRIDarray ) != -1 ) {

						//FIX
						var otherID = $.inArray( String(parseInt($(this).attr('data-index'))), otherRIDarray );
						$(this).find('.otherText').hide();
						$(this).find('.otherText').val('');
						$(this).find('.otherHidden').val('');
						$( '#'+otherQIDarray[otherID] ).val('');
					}

					if (!$target.hasClass('ns')) {
						setMin(rankCount, options.setMin);
					} else {
						setMin(0, options.setMin);
					}

				}

				// Update position using isotope
				if((!dkselected && animatedResponses) || (!dkselected && layout === "fitRows")){
					$container.isotope('updateSortData', $container.find('.statement'));
					$container.isotope(istopeOptions);
				}
                if (window.askia
                    && window.arrLiveRoutingShortcut
                    && window.arrLiveRoutingShortcut.length > 0
                    && window.arrLiveRoutingShortcut.indexOf(options.currentQuestion) >= 0) {
                    askia.triggerAnswer();
                }
			}

		}

		// Select a statement
		// @this = target node
		function deselectAllStatements() {
			dkselected = false;

			$container.find( '.statement' ).each(function(i, obj) {

				var $target = $(obj),
					index	= $target.data('index'),
					$input = items[index].element,
					value	= parseInt($input.val(), 10);

				if (!value) { // item is currently UNranked

				} else { // item is currently ranked

					rankCount -= 1;
					$input.val("");

					$target.removeClass('ranked')           // Remove ranked class
						.find('.rank_text').html(''); // Remove rank value

					// Rerank other items
					$container.find('.statement').each(function() {
						var $current = $(obj),
							currentItem  = items[$current.data('index')],
							currentValue = parseInt(currentItem.element.val(), 10);

						if ($current !== $target && currentValue && currentValue > value) {
							// Re-number item
							currentItem.element.val(currentValue - 1);
							$current.find('.rank_text').html(currentValue - 1);
						}

					});

				}

				// Update position using isotope
				if (animatedResponses || layout === "fitRows") {
					$container.isotope('updateSortData', $container.find('.statement'));
					$container.isotope(istopeOptions);
				}
			});

			setMin(rankCount, options.setMin);

		}

		// Check for missing images and resize
		$container.find('.statement img').each(function forEachImage() {

			var size = {
				width: $(this).width(),
				height: $(this).height()
			};

			if (options.forceImageSize === "height" ) {
				if ( size.height > options.forcedImageHeight ) {
					var ratio = (options.forcedImageHeight / size.height);
					size.height *= ratio,
					size.width  *= ratio;
				}// else applyPaddingTo = "height";
			} else if (options.forceImageSize === "width" ) {
				if ( size.width > options.forcedImageWidth) {
					var ratio = (options.forcedImageWidth / size.width);
					size.width  *= ratio,
					size.height *= ratio;
				}// else applyPaddingTo = "width";

			} else if (options.forceImageSize === "both" ) {
				if (options.forcedImageHeight > 0 && size.height > options.forcedImageHeight) {
					var ratio = (options.forcedImageHeight / size.height);
					size.height *= ratio,
					size.width  *= ratio;
				}

				if (options.forcedImageWidth > 0 && size.width > options.forcedImageWidth) {
					var ratio = (options.forcedImageWidth / size.width);
					size.width  *= ratio,
					size.height *= ratio;
				}


			}
			$(this).css(size).css('margin-right', $container.find('.rank_text').outerWidth(true) + 'px');
		});

		// add ns to last x items
		if ( options.numberNS > 0 ) $('.statement').slice(-options.numberNS).addClass('ns');

		for ( var i=0; i<items.length; i++ ) {

			// Value of the input
			var value = parseInt(items[i].element.val(), 10);

			var isRanked = Boolean(!isNaN(value) && value); // Verify if the value is a number greather than 0
			if ( isRanked ) rankCount++;

			$container.children('.statement:eq(' + i + ')').data('index', i).addClass(isRanked?'ranked':'').find('.rank_text').html(value);

			if ( isRanked ) $container.children('.statement:eq(' + i + ')').find('.otherText').show();

			if ((isRanked && (i+1) === items.length && (options.dkActivated == 1 || options.dkActivated == 2) ) || (isRanked && (i+1) === (items.length - 1) && (options.dkActivated == 2) )) {

				dkselected = true;

				$container.children('.statement:eq(' + i + ')').find('.rank_text').html(''); // Add rank value
			}

		};

		if ( options.forceResponseSize === 'no' ) {
			$('.statement').width($('.statement').width());
		} else if ( options.forceResponseSize === 'width' && options.forcedResponseWidth !== '' ) {
			$('.statement').width( options.forcedResponseWidth );
		} else if ( options.forceResponseSize === 'height' && options.forcedResponseHeight !== '' ) {
			$('.statement').height( options.forcedResponseHeight );
		} else if ( options.forceResponseSize === 'both' && options.forcedResponseWidth !== '' && options.forcedResponseHeight !== '' ) {
			$('.statement').width( options.forcedResponseWidth ).height( options.forcedResponseHeight );
		}

		//alert(dkselected);
		if((!dkselected && animatedResponses) || (!dkselected && layout === "fitRows")){
			$container.isotope(istopeOptions);
		}
		//$container.delegate('.statement', 'click', selectStatement);
			$container.on('click', '.statement', selectStatement);


		function showMoveOptions(e) {
			$(e.delegateTarget).append('<div class="rerankContainer"><div class="upRank"></div><div class="downRank"></div></div>');
			var marginAdjustmentTB = Math.floor( ($('.rerankContainer').outerHeight() - 17 )/2 ),
				marginAdjustmentLR = Math.floor( ($('.rerankContainer').parent('.statement').width() - 45 )/2 );
			$('.rerankContainer').css({ 'margin':marginAdjustmentTB + 'px ' + marginAdjustmentLR + 'px ' + marginAdjustmentTB + 'px ' + marginAdjustmentLR + 'px ' }).height(17).width(45);
			$('.upRank').on('click', rankup);
			$('.downRank').on('click', rankdown);
			// hide ranking options after 2 seconds
			setTimeout( hideMoveOptions, 2000);
		}

		function hideMoveOptions(e) {
			$( ".rerankContainer" ).remove();
		}

		function rankup(e) {

			e.stopPropagation();

			var $target = $(e.delegateTarget).parents('.statement'),
				index	= $target.data('index'),
				$input = items[index].element,
				value	= parseInt($input.val(), 10);

			if (!value) { // item is currently UNranked

				if ((rankCount + 1) <= options.setMax) {
					rankCount += 1;
					$input.val(rankCount);

					$target.addClass('ranked')                // Add ranked class
						.find('.rank_text').html(rankCount); // Add rank value
				}
			} else { // item is currently ranked

				if ( value > 1 ) {

					value  -= 1;

					// Rerank other items
					$container.find('.statement').each(function() {
						var $current = $(this),
							currentItem  = items[$current.data('index')],
							currentValue = parseInt(currentItem.element.val(), 10);

						if ($current !== $target && currentValue && currentValue == value) {
							// Re-number item
							currentItem.element.val(currentValue + 1);
							$current.find('.rank_text').html(currentValue + 1);
						}

					});

					// Move item up a rank
					$input.val(value);
					$target.find('.rank_text').html(value); // Add rank value

				}

			}

			// Update position using isotope
			if (animatedResponses || layout === "fitRows") {
				$container.isotope('updateSortData', $container.find('.statement'));
				$container.isotope(istopeOptions);
			}
            if (window.askia
                && window.arrLiveRoutingShortcut
                && window.arrLiveRoutingShortcut.length > 0
                && window.arrLiveRoutingShortcut.indexOf(options.currentQuestion) >= 0) {
                askia.triggerAnswer();
            }
		}

		function rankdown(e) {

			e.stopPropagation();


			var $target = $(e.delegateTarget).parents('.statement'),
				index	= $target.data('index'),
				$input = items[index].element,
				value	= parseInt($input.val(), 10);

			if (!value) { // item is currently UNranked

				if ((rankCount + 1) <= options.setMax) {
					rankCount += 1;
					$input.val(rankCount);

					$target.addClass('ranked')                // Add ranked class
						.find('.rank_text').html(rankCount); // Add rank value
				}

			} else { // item is currently ranked

				if ( value < items.length && value < $('.ranked').length ) {

					value  += 1;

					// Rerank other items
					$container.find('.statement').each(function() {
						var $current = $(this),
							currentItem  = items[$current.data('index')],
							currentValue = parseInt(currentItem.element.val(), 10);

						if ($current !== $target && currentValue && currentValue == value) {
							// Re-number item
							currentItem.element.val(currentValue - 1);
							$current.find('.rank_text').html(currentValue - 1);
						}

					});

					// Move item up a rank
					$input.val(value);
					$target.find('.rank_text').html(value); // Add rank value

				}

			}

			// Update position using isotope
			if (animatedResponses || layout === "fitRows") {
				$container.isotope('updateSortData', $container.find('.statement'));
				$container.isotope(istopeOptions);
			}
            if (window.askia
                && window.arrLiveRoutingShortcut
                && window.arrLiveRoutingShortcut.length > 0
                && window.arrLiveRoutingShortcut.indexOf(options.currentQuestion) >= 0) {
                askia.triggerAnswer();
            }
		}

		// Assign hover function
		if ( showRankMoveControls ) {
			if ( !((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/iPad/i))) ) {
				$container.find('.statement').hover(showMoveOptions, hideMoveOptions);
			}
		}

		function writeText() {
			$( '#'+otherQIDarray[parseInt($(this).data('id'))-1] ).val( $(this).val().trim() );
            if (window.askia
                && window.arrLiveRoutingShortcut
                && window.arrLiveRoutingShortcut.length > 0
                && window.arrLiveRoutingShortcut.indexOf(options.currentQuestion) >= 0) {
                askia.triggerAnswer();
            }

		}

		$( '.otherText' ).on('focus', function(srcc) {
			if ($(this).val() == $(this)[0].title) {
				$(this).removeClass("defaultTextActive");
				$(this).val("");
			}
		});

		$( '.otherText' ).on('blur', function() {
			if ($(this).val() == "") {
				$(this).addClass("defaultTextActive");
				$(this).val($(this)[0].title);
			}
		});

		$(this).parents('.controlContainer').find( '.otherText' ).trigger('blur');


		$(this).parents('.controlContainer').find( '.otherText' ).on('keyup', writeText).on('click', function(e) {
			e.stopPropagation();
		});

		if ( total_images > 0 ) {
			$container.find('img').each(function() {
				var fakeSrc = $(this).attr('src');
				$("<img/>").css('display', 'none').on('load', function() {
					images_loaded++;
					if (images_loaded >= total_images) {

					}
				}).attr("src", fakeSrc);
			});
		} else {

		}

    setTimeout(function(){ document.querySelector("#adc_" + options.instanceId).style.visibility = 'visible'; }, 300);

		setMin(rankCount,options.setMin);

		var ns = document.querySelectorAll('.ns');
		var nextButton = document.querySelector("input[name='Next']");
		for (var i = 0; i < ns.length; i++) {
			if (ns[i].classList.contains('ranked')) {
				nextButton.disabled = false;
				nextButton.classList.remove('disabled');
				nextButton.classList.remove('secondary');
			}
		}

		return this;
	}

} (jQuery));
