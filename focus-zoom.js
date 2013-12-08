var focusZoom = (function() {
	'use strict';

	var DURATION = 200;

	var focusZoom = {
		trigger: trigger,
		enabled: true
	};

	var prevFocused = null;
	var docElem = document.documentElement;
	var keyDownTime = 0;

	var webkitPrefix = typeof docElem.style.transform !== 'string' && typeof docElem.style.webkitTransform === 'string';
	var transformProperty = webkitPrefix ? '-webkit-transform' : 'transform';
	var transitionProperty = transformProperty + ' ' + DURATION/1000 + 's cubic-bezier(0, 0.2, 0, 1)';


	docElem.addEventListener('keydown', function(event) {
		var code = event.which;
		// Show animation only upon Tab or Arrow keys press.
		if (code === 9 || (code > 36 && code < 41)) {
			keyDownTime = Date.now();
		}
	}, false);


	function trigger(target) {
		onEnd();
		prevFocused = target;
		setTransform(target, 'scale(1.4)');
		requestAnimationFrame(function() {
			enableTransition(target);
			requestAnimationFrame(function() {
				setTransform(target, '');
				setTimeout(function() {
					disableTransition(target);
				}, DURATION);
			});
		});
	}


	docElem.addEventListener('focus', function(event) {
		if (!focusZoom.enabled) {
			return;
		}

		if (Date.now() - keyDownTime > 42) {
			return;
		}

		trigger(event.target);
	}, true);


	docElem.addEventListener('blur', function() {
		onEnd();
	}, true);


	function onEnd() {
		if (!prevFocused) return;
		setTransform(prevFocused, '');
		disableTransition(prevFocused);
	}


	function enableTransition(element) {
		element.style.transition = transitionProperty;
	}

	function disableTransition(element) {
		element.style.transition = '';
	}

	function setTransform(element, value) {
		element.style[webkitPrefix ? 'webkitTransform' : 'transform'] = value;
	}

	return focusZoom;
})();
