define(function () {

    /*
        Basetype.extend() returns a constructor function. The constructor function has
        it's prototype configured using the template object passed in to extend().If
        the template has an initialise() method this will be called automatically
        with arguments passed in from the constructor function. The constructor
        function itself has the extend() method as a static method so that
        it can be used to implement inheritance.
    */

    return {

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
                    F[prop] = staticMembers[staticMember];
                }
            }

            F.prototype.constructor = F;

            return F;
        }
    };

});


