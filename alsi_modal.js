;(function($) {
	$.alsiModalGlobals = {
		'showPrevious': false,
		'skip': 0,
		'emptyError': false,
		'showVariable': 'default',
		'formReset': true,
		'modalDialogStack': new Array(),
		'bodyScrollable': false,
		'minTopOffset': 40,
		'mask': true,
		'maskId': 'mask',
		'closeClass': 'close',
		'closeOnEscape': true,
		'maskAnimation': {
			opacity: 'toggle',
		},
		'modalAnimation': {
			opacity: 'toggle',
		},
		'maskAnimationSpeed': '',
		'modalAnimationSpeed': ''
	};

	$.fn.modal = function(options) {
		var $modalDialog = this.parent();
		// Hide currently visible window.
		$('#modal-dialog .window').hide();
		// Empty first object, since $.extend also seems to save to the first object,
		// other than just return the new concatenated object. BASTARD!
		var settings = $.extend({}, $.alsiModalGlobals, options);
		var modalDialogStack = $.alsiModalGlobals.modalDialogStack;
		
		var contentModal;
		if (true == settings.showPrevious) {
			// Removes current popup from stack.
			modalDialogStack.pop();
			// {skip: n} to skip n number of previous modals.
			if (settings.skip) {
				for (var i = 0; i < settings.skip; i++) {
					modalDialogStack.pop();
				}
			}
			// All the modal dialogs to be skipped have been poped off. Now picks the last one
			// and moves on with display logic.
			contentModal = modalDialogStack[modalDialogStack.length-1];
		} else {
			contentModal = this;
			// Push DOM el to be displayed to stack.
			modalDialogStack.push(contentModal);
		}

		// Empties the '.error' fields by default unless '{emptyError: false}' is passed in options.
		if (true == settings.emptyError) {
			contentModal.find('.error').empty();
		}
		// If '{showVariable: VARIABLE_NAME}' is passed in options, displays those variable fields and hides
		// all others, if not, hides all except '.variable.default'.
		contentModal.find('.variable:not(".' + settings.showVariable + '")').addClass('no-display');
		contentModal.find('.variable.' + settings.showVariable).removeClass('no-display');
		// Resets all forms in DOM by default unless '{formReset}: false' is passed in options.
		if (true == settings.formReset) {
			contentModal.find('form').each(function() {
				this.reset();
			});
		}

		var winWidth = $(window).width();
		var winHeight = $(window).height();
		if (true == settings.mask) {
			var mask = $('#' + settings.maskId);
			// Sets height and width to mask to fill up the whole screen.
			mask.css({'width': winWidth, 'height': winWidth});
			mask.stop().animate(settings.maskAnimation, settings.maskAnimationSpeed);
		}
		$modalDialog.css({'width': winWidth, 'height': winHeight});
		$modalDialog.show();
		// Sets the popup window to center.
		contentModal.css('left', winWidth / 2 - contentModal.width() / 2);
		var top = winHeight / 2 - contentModal.height() / 2;
		if (top <= 0) {
			top = settings.minTopOffset;
		}
		contentModal.css('top', top);
		contentModal.stop().animate(settings.modalAnimation, settings.modalAnimationSpeed);

		// Makes the body unscrollable when the modal dialog is open, is {bodyScrollable: false}
		// Do this at the end, incase something breaks. Don't want to be stuck with a unscrollable body, do we now?
		if (settings.bodyScrollable == false) {
			$("body").addClass("noscroll");
		}
		
		$(window).bind('resize.alsiModal', function(e) {
			winHeight = $(window).height();
			winWidth = $(window).width();
			mask.css('width', winWidth);
			$modalDialog.css({'width': winWidth, 'height': winHeight});
			contentModal.css('left', winWidth / 2 - contentModal.width() / 2);
			var top = winHeight / 2 - contentModal.height() / 2;
			if (top <= 0) {
				top = settings.minTopOffset;
			}
			contentModal.css('top', top);
		});

		/*
			One click to close it,
			On the close button,
			Or on the mask,
			One keyup to bind them all,
			In the darkness... err... close the popup/
		*/
		if (settings.mask == true) {
			mask.click(function(e) {
				e.stopPropagation();
				closeModalPopup();
			});
		}
		contentModal.find('.' + settings.closeClass).click(function(e) {
			e.preventDefault();
			e.stopPropagation();
			closeModalPopup();
		});
		if (true == settings.closeOnEscape) {
			$(document).bind('keyup.alsiModal', function(e) {
				if (e.keyCode == 27) {
					closeModalPopup();
				}
			});
		}
		function closeModalPopup() {
			$(window).unbind('.alsiModal');
			$(document).unbind('.alsiModal');
			$.alsiModalGlobals.modalDialogStack.pop();
			contentModal.siblings('.window').hide();
			contentModal.stop().animate(settings.modalAnimation, settings.modalAnimationSpeed, function() {
				$modalDialog.hide();
			});
			if (settings.mask == true) {
				mask.stop().animate(settings.maskAnimation, settings.maskAnimationSpeed);
			}
			// make body scrollable again
			if (settings.bodyScrollable == false) {
				$("body").removeClass("noscroll");
			}
		}
	}

})(jQuery);