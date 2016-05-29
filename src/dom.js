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
			var parent = descendant.parentNode,
			    conditionFunc;

			if(isString(condition)) {
				conditionFunc = function (el) {
					return matches(el, condition);
				}
			} else {
				conditionFunc = condition;
			}

			if(conditionFunc(descendant)) {
				return descendant;
			} else if(parent === null) {
				return false;
			} else if(parent === ancestor) {
				return conditionFunc(parent) ? parent : false;
			} else {
				return dom.searchAncestors(parent, condition, ancestor);
			}
		},

		delegate : function (el, eventType, targetSelector, handler, context) {
			if(context) {
				handler = handler.bind(context);
			}
			el.addEventListener(eventType, function (event){
				// are we on the element the handler is attached to?
				if(event.target === event.currentTarget) {
					handler(event);
					return;
				}
				var target = dom.searchAncestors(event.target, targetSelector, event.currentTarget);
				if(target) {
					// how to create synthetic event as if it occurred on this target?
					handler({
						target : target, // actual element the user clicked
						currentTarget: target, // event current target refers to that specified by the targetSelector
						preventDefault : event.preventDefault.bind(event), // delegates to original event object
						stopPropagation : event.stopPropagation.bind(event),
						which : event.which,
						originalEvent : event
					});
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


