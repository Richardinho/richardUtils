(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		define(function () {
			return factory();
		});
	} else if (typeof module === 'object' && module.exports) {
		module.exports = factory();
	} else {
		root.BaseType = factory();
	}
}(this, function () {

	'use strict';

	return  {

		/**
		 * extends method for inheritance
		 * @param {Object} template - properties to be added to prototype of new type
		 * @param {Object} staticMembers - static members of new type
		 * @returns {Function} Constructor function of new type
		 */
		extend : function (template, staticMembers) {

			var F = function(options) {

				if(this.initialize && typeof this.initialize === "function") {
					this.initialize(options);
				}
			};

			var Proxy = function () {};

			Proxy.prototype = this.prototype;

			F.prototype = new Proxy();

			for (var prop in template) {
				if(template.hasOwnProperty(prop)) {
					F.prototype[prop] = template[prop];
				}
			}

			F.extend = this.extend;

			for (var staticMember in staticMembers) {

				if(staticMembers.hasOwnProperty(staticMember)) {
					F[staticMember] = staticMembers[staticMember];
				}
			}

			F.prototype.constructor = F;

			return F;
		}
	};
}));


