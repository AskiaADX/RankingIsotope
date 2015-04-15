(function ($) {
	"use strict";

	$.fn.adcRanking = function adcRanking(options) {

		// MS: Syntax to set the default value or use the one specified
		(options.width = options.width || "auto");
		(options.height = options.height || "auto");
		(options.setMax = options.setMax || $(this).children('.statement').size());
		
		$(this).css({'max-width':options.maxWidth,'width':options.controlWidth});
		$(this).parents('.controlContainer').css({'width':'100%','overflow':'hidden'});
		
		if ( options.controlAlign === "center" ) {
			$(this).parents('.controlContainer').css({'text-align':'center'});
			$(this).css({'margin':'0px auto'});
		} else if ( options.controlAlign === "right" ) {
			$(this).css({'margin':'0 0 0 auto'});
		}
		
		var dkActivated = options.dkActivated;
		var dkselected = false;
		
		// List of items collection of object {caption : 'The caption', element : jQueryObject}
		var $container = $(this),
			items = options.items,
			showRankMoveControls = Boolean(options.showRankMoveControls),
			rankCount = 0,				// Number of ranked items
			istopeOptions = {			// Isotope options
				itemSelector: '.statement',
				layoutMode: options.layout,
				getSortData: {
					rank: function($elem) {
						var index = $elem.data('index'),
							item = items[index];
						return parseInt(item.element.val(), 10) || 999;
					}
				},
				sortBy: 'rank'
			},
			total_images = $container.find("img").length,
			images_loaded = 0;

		// Select a statement
		// @this = target node
		function selectStatement(e) {
			
			//console.log ( (!$(e.target).hasClass('upRank') && !$(e.target).hasClass('downRank')) + ":" + !$(e.target).hasClass('upRank') +":"+ !$(e.target).hasClass('downRank'));
			if ( !$(e.target).hasClass('upRank') && !$(e.target).hasClass('downRank') ) {
			
				var $target = $(this),
					index	= $target.data('index'),
					$input = items[index].element,
					value	= parseInt($input.val(), 10);

				if (!value) { // item is currently UNranked
					if((index+1) == items.length && dkActivated){
						deselectAllStatements();
						dkselected = true;
						
						if ((rankCount + 1) <= options.setMax) {
							rankCount += 1;
							$input.val(rankCount);

							$target.addClass('ranked')                // Add ranked class
								.find('.rank_text').html(''); // Add rank value
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
						}
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

				}

				// Update position using isotope
				if(!dkselected){
					$container.isotope('updateSortData', $container.find('.statement'));
					$container.isotope(istopeOptions);
				}
				
			}
			
			/*if ( showRankMoveControls && (navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/iPad/i)) ) {
				//showMoveOptions();
			}*/
		}
		
		// Select a statement
		// @this = target node
		function deselectAllStatements() {
			dkselected = false;
			//$container.on('click', '.statement', selectStatement);
			$container.find( '.statement' ).each(function(i, obj) {
			
				var $target = $(obj),
					index	= $target.data('index'),
					$input = items[index].element,
					value	= parseInt($input.val(), 10);

				if (!value) { // item is currently UNranked
					/*
					if ((rankCount + 1) <= options.setMax) {
						rankCount += 1;
						$input.val(rankCount);

						$target.addClass('ranked')                // Add ranked class
							.find('.rank_text').html(rankCount); // Add rank value
					}
					*/
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
				$container.isotope('updateSortData', $container.find('.statement'));
				$container.isotope(istopeOptions);
			});
			
		}
		
		// Check for missing images and resize
		$container.find('.statement img').each(function forEachImage() {
			//if ( $(this).attr('src') == '' ) /*$(this).remove();*/alert("foo");
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
			
			if(isRanked && (i+1) == items.length){
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

		if(!dkselected){
			$container.isotope(istopeOptions);
		}	
		//$container.delegate('.statement', 'click', selectStatement);
			$container.on('click', '.statement', selectStatement);
		
		
		function showMoveOptions(e) {
			$(e.delegateTarget).append('<div class="rerankContainer"><div class="upRank"></div><div class="downRank"></div></div>');
			var marginAdjustmentTB = Math.floor( ($('.rerankContainer').outerHeight() - 17 )/2 ),
				marginAdjustmentLR = Math.floor( ($('.rerankContainer').parent('.statement').width() - 45 )/2 );
			$('.rerankContainer').css({ 'margin':marginAdjustmentTB + 'px ' + marginAdjustmentLR + 'px ' + marginAdjustmentTB + 'px ' + marginAdjustmentLR + 'px ' }).height(17).width(45);
			$('.upRank').click(rankup);
			$('.downRank').click(rankdown);
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
			$container.isotope('updateSortData', $container.find('.statement'));
			$container.isotope(istopeOptions);
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
			$container.isotope('updateSortData', $container.find('.statement'));
			$container.isotope(istopeOptions);
		}
		
		// Assign hover function
		if ( showRankMoveControls ) {
			if ( !((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/iPad/i))) ) {
				$container.find('.statement').hover(showMoveOptions, hideMoveOptions);
			}
		}
		
		if ( total_images > 0 ) {
			$container.find('img').each(function() {
				var fakeSrc = $(this).attr('src');
				$("<img/>").css('display', 'none').load(function() {
					images_loaded++;
					if (images_loaded >= total_images) {
						
						// now all images are loaded.
						$container.css('visibility','visible');
	
					}
				}).attr("src", fakeSrc);
			});
		} else {
			$container.css('visibility','visible');
		}
		
		return this;
	}

} (jQuery));