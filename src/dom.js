(function () {

	"use strict";
	//  promote to string utils file
	function isString(val) {
		return typeof val === 'string';
	}

	function isFunction() {
  }

	function matches(elm, selector) {
		var matches = (elm.document || elm.ownerDocument).querySelectorAll(selector),
				i = matches.length;
		while (--i >= 0 && matches.item(i) !== elm) {}
		return i > -1;
	}

	var dom = {
		//  wrapper for querySelector()
		$ : function(selector, context) {
			return (context || document).querySelector(selector);
		},
		//  wrapper for querySelectorAll()
		$$ : function () {},

		//  condition is either a selector string or a function as per strategy pattern
		searchAncestors : function (descendant, condition, ancestor){
			var parent = descendant.parentNode;
			if(isString(condition)) {
				if(matches(descendant, condition)) {
					return descendant;
				} else if(parent === null) {
					return false;
				} else if(parent === ancestor) {
					return matches(parent, condition);
				} else {
					return dom.searchAncestors(parent, condition, ancestor);
				}
			} else if(isFunction(condition)) {
				// allow user to supply a function which carries out the test on the current node
			}
		},

		delegate : function (el, eventType, targetSelector, handler, context) {
			if(context) {
				handler = handler.bind(context);
			}
			el.addEventListener(eventType, function (event){
				if(event.target === event.currentTarget) {
					handler(event);
					return;
				}
				var target = dom.searchAncestors(event.target, targetSelector, event.currentTarget);
				if(target) {
					// how to create synthetic event as if it occurred on this target?
					handler({
						target : target,
						currentTarget, el
					}));
				}
			});
		}
	};

	if (typeof define != "undefined") {
		define(function () {
			return dom;
		});
	} else {
		window.domutils = dom;
	}

})();


