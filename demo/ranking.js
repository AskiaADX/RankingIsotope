(function ($) {
	"use strict";

	function adcRanking(options) {

		// MS: Syntax to set the default value or use the one specified
		(options.width = options.width || 400);
		(options.height = options.height || "auto");
		(options.imageAlign = options.imageAlign || 'left');
		(options.loading = options.loading || 'Loading $prct');

		// List of items collection of object {caption : 'The caption', element : jQueryObject}
		var items = options.items,
			// Loading message container
		    $loading = document.createElement('div'),
			// Rebuild the selector for the container
			container = '#' + options.target,
			// Number of ranked items
			rankCount = 0,
			// Isotope options
			istopeOptions = {
				itemSelector: '.statement',
				layoutMode: 'straightDown',
				getSortData: {
					rank: function($elem) {
						var index = $elem.data('index'),
							item = items[index];
						return parseInt(item.element.val(), 10) || 999;
					}
				},
				sortBy: 'rank'
			};

		// Select a statement
		// @this = target node
		function selectStatement() {

			var $container = $(container),
				$target	   = $(this),
				index	   = $target.data('index'),
				item       = items[index],
				value	   = parseInt(item.element.val(), 10);

			if (!value) { // item is currently UNranked
				if ((rankCount + 1) <= options.setMax) {
					rankCount += 1;
					item.element.val(rankCount);

					$target.addClass('ranked')                // Add ranked class
						.find('.rank_text').html(rankCount); // Add rank value
				}
			} else { // item is currently ranked

				rankCount -= 1;
				item.element.val("");

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
			$container.isotope('updateSortData', $container.find('.statement'));
			$container.isotope(istopeOptions);
		}

		// Build the statement list
		// According to the presence of images, this method could be called once all images are fully loaded

		function build() {
			// MS: Using the EcmaScript 5 (ES5), you gain the forEach method on loop, which is better than a classical for-loop because 
			// MS: it's a real iterator Design Pattern and it creates a scope for the loop. Meaning that all variables inside that function is only available during the loop.
			// MS: Perform a single iteration for everything

			items.forEach(function(item, index) {

				// Value of the input
				var value = parseInt(item.element.val(), 10);
				var isRanked = (!isNaN(value) && value), // Verify if the value is a number greather than 0

				// Main HTML element
					$el = $(document.createElement('div'))
						.css({
							width: '95%',
							height: options.height
							// PF: Removed as this will break the layout if the text is too long 'line-height': options.height + 'px'
						})
						.addClass('istope-item')
						.addClass('statement'),
					// Text of response
					$text = $(document.createElement('span')),
					// Rank value
					$rank = $(document.createElement('span')),
					// Image of response
					$img = $(document.createElement('img')),
					// Image size
					size;

				if (isRanked) {
					rankCount += 1;
					$el.addClass("ranked");
				}

				// Set the index into the data of the element
				$el.data('index', index);

				// Append the rank value
				$rank.html(value || '')
					.addClass('rank_text')
					.appendTo($el);


				// Append the text
				$text.html(item.caption)
					.addClass('statement_text')
					.appendTo($el);

				// AddEvent
				$el.click(selectStatement);

				// Add it into the DOM
				$(container).append($el);
			});


			// Use the isotope for the animation
			$(container).isotope(istopeOptions);
		}

		build();
	}

	$.adcRanking = adcRanking;

} (jQuery));