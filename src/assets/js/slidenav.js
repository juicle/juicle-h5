/*===============================================================================
************   SlideNav   ************
===============================================================================*/
/* global Zepto:true */
+ function($) {
	"use strict";
	$.fn.sliderNav = function(options) {
		$(".indexlist-navitem").bind("touchstart", function(event) {
			var target = $(this).text();
			scrollToTarget(target.toLowerCase());
			$.toast(target, 2000, "hint");
		});
		var currentTarget = "";
		$(".indexlist-navlist").bind("touchmove", function(event) {
			event.preventDefault();
			var element = document.elementFromPoint(event.touches[0].clientX, event.touches[0].clientY);
			if (!!element&&element.getAttribute("class")=="indexlist-navitem") {
				var target = element.innerHTML;
				if (target != currentTarget) {
					scrollToTarget(target.toLowerCase());
					var $toast = $('<div class="modal toast hint">' + target + '</div>').appendTo(document.body);
					$.openModal($toast);
				}
				currentTarget = target;
				$(".indexlist-navitem").bind("touchend", function(event) {
					$(".hint").remove();
				});
			} else {
                return ;
			}


		});

		function scrollToTarget(target) {
			var offset = $('li[name="' + target + '"]').closest(".list-group").position().top;
			$('.list-index-list').scrollTop($('.list-index-list').scrollTop() + offset);
		}



	}
}(Zepto);