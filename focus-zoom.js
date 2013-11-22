var DURATION = 300;

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


docElem.addEventListener('focus', function(event) {
	if (window.FOCUS_ZOOM_DISABLED) {
		return;
	}

	if (Date.now() - keyDownTime > 42) {
		return;
	}

	var target = event.target;
	abort();
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

}, true);


docElem.addEventListener('blur', function() {
	abort();
}, true);


function abort() {
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

