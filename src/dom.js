
	(function (root, factory) {
		'use strict';

		if (typeof define === 'function' && define.amd) {
			define(['./sundry'], factory);
		} else if (typeof module === 'object' && module.exports) {
			module.exports = factory(require('./sundry.js'));
		} else {
			// Browser globals (root is window)
			root.domutils = factory(sundry);
		}
	}(this, function (sundry) {

		'use strict';

		var domutils =  {

			/**
			*  alias for querySelector()
			*  @function
			*  @name $
			*  @param selector {String} CSS selector
			*  @param {Element} context
			*  @returns {Element} or {Null} if none found
			*/
			$ : function(selector, context) {
				return (context || document).querySelector(selector);
			},

			/**
			*  alias for querySelectorAll - still to be implemented
			*  @function
			*  @name $$
			*/
			$$ : function () {},

			/**
			*
			*  Get the immediately preceding sibling of the given element.
			*  If a selector is provided, it retrieves the previous
			*  sibling only if it matches that selector.
			*
			*  @function
			*  @name prev
			*  @param {Element} el reference element
			*  @param {String} selector selector to match candidate elements to
			*  @returns {Element} or null if none found
			*/
			prev : function (el, selector) {
				var prevSibling = el.previousElementSibling;
				return prevSibling && domutils.matches(prevSibling, selector) ? prevSibling : null;
			},


			/**
			*  Get the next sibling of the given element.
			*  If a selector is provided, it retrieves the next
			*  sibling only if it matches that selector.
			*
			*  @function
			*  @name next
			*  @param {Element} reference element
			*  @param {String} selector selector to match candidate elements to
			*  @returns {Element} or null if none found
			*/
			next : function (el, selector) {
				var nextSibling = el.nextElementSibling;
				return nextSibling && domutils.matches(nextSibling, selector) ? nextSibling : null;
			},

			/**
			*  Get the parent  of the given element.
			*  If a selector is provided, it retrieves the parent
			*  only if it matches that selector.
			*
			*  @function
			*  @name parent
			*  @param {Element} reference element
			*  @param {String} selector selector to match candidate elements to
			*  @returns {Element} or null if none found
			*/
			parent : function (el, selector) {
				var parent = el.parentNode;
				return parent && domutils.matches(parent, selector) ? parent : null;
			},

			/**
			*  polyfill for Element.matches function
			*  method returns true if the element would be selected by the specified selector string;
			*  otherwise, returns false.
			*
			*/
			matches : function (elm, selector) {
				var matches = (elm.document || elm.ownerDocument).querySelectorAll(selector),
						i = matches.length;
				while (--i >= 0 && matches.item(i) !== elm) {}
				return i > -1;
			},

			/**
			*
			* @function insertAfter
			*
			*
			*/
			insertAfter : function (newEl, referenceEl) {

				var parentEl = referenceEl.parentElement;
				var nextSibling = referenceEl.nextElementSibling;
				// if next sibling is null, insertBefore will insert newEl as the last child of the parent.
				parentEl.insertBefore(newEl, nextSibling);
			},

			/**
			*  condition is either a selector string or a function as per strategy pattern
			*
			*  @function searchAncestors
			*
			*/
			searchAncestors : function (descendant, condition, ancestor){
				var parent = descendant.parentNode,
				    conditionFunc;

				if(sundry.isString(condition)) {
					conditionFunc = function (el) {
						return domutils.matches(el, condition);
					};
				} else if(sundry.isFunction(condition)) {
					conditionFunc = condition;
				} else {
					throw {
						message : 'condition must be a string or a function'
					};
				}

				if(conditionFunc(descendant)) {
					return descendant;
				} else if(parent === null) {
					return false;
				} else if(parent === ancestor) {
					return conditionFunc(parent) ? parent : false;
				} else {
					return domutils.searchAncestors(parent, condition, ancestor);
				}
			},

			/**
			*
			*  Registers a handler on a delegate element which will handle event on behalf of delegator elements.
			*  The delegator element does not have to be the physical element on which the event originally
			*  fires on. Since the event bubbles up we can specify an ancestor element, defined by the targetSelector,
			*  on which we will call a handler along with a synthetic event as if the event fired on this element.
			*
			*  @function
			*  @name delegate
			*  @param el {Element} the delegate which will handle events on behalf of other elements
			*  @param eventType {String} event type
			*  @param targetSelector {Element} the delegator
			*  @param handler {Function} handler function
			*  @param context {Object} context to bind the handler to
			*/
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
					var target = domutils.searchAncestors(event.target, targetSelector, event.currentTarget);
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
			},

			/**
			*  Selects a child element by index
			*  @function nthChild
			*  @param {Element} parent element
			*  @param {Number} index of element to select within array of child elements
			*  @returns {Element} child element found
			*/
			nthChild : function (el, index) {
				return el.children[index];
			}
		};

		return domutils;

	}));



