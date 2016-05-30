(function () {

	"use strict";
	//  promote to string utils file
	function isString(val) {
		return typeof val === 'string';
	}

	function isFunction(val) {
		return typeof val === "function"
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


		insertAfter : function (newEl, referenceEl) {

			var parentEl = referenceEl.parentElement;
			var nextSibling = referenceEl.nextElementSibling;
			// if next sibling is null, insertBefore will insert newEl as the last child of the parent.
			parentEl.insertBefore(newEl, nextSibling)
		},

		//  condition is either a selector string or a function as per strategy pattern
		searchAncestors : function (descendant, condition, ancestor){
			var parent = descendant.parentNode,
			    conditionFunc;

			if(isString(condition)) {
				conditionFunc = function (el) {
					return matches(el, condition);
				}
			} else if(isFunction(condition)) {
				conditionFunc = condition;
			} else {
				throw {
					message : 'condition must be a string or a function'
				}
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
						target : target,
						currentTarget: el,
						preventDefault : event.preventDefault.bind(event), // delegates to original event object
						stopPropagation : event.stopPropagation.bind(event),
						which : event.which,
						originalEvent : event
					});
				}
			});
		}
	};

	//  https://github.com/requirejs/requirejs/wiki/Updating-existing-libraries#anon
	if ( typeof define === "function" && define.amd ) {
		define(function() {
			return dom;
		});
	} else if (typeof module === "object" && module && typeof module.exports === "object") {
		module.exports = dom;
	} else if(typeof window === "object") {
		window.domutils = dom;
	}

})();


