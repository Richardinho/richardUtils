define([ 'eventNode' ], function( EventNode ) {

    describe('event enhanced json', function() {

        var foo;

        beforeEach(function () {

            foo = new EventNode({

                bar : {

                    dan1 : "dan1",
                    dan2 : "dan2",

                    eco : {

                        goat : {

                            hat1 : "hat1",
                            hat2 : "hat2"
                        }
                    }
                }
            });
        });

        /*
            children of passed in object should be recursively wrapped in Node object
        */
        it('should be able to access value of child nodes', function() {
           expect(foo.children['bar'].children['dan1'].value).toBe("dan1");
        });

        /*
            it should be possible for a handler registered for an event string on a child
            node to be called when that event is fired on an ancestor node.
        */
        describe("broadcasting", function () {
            var eventArg;
            beforeEach(function () {
                var childNode = foo.children['bar']
                                    .children['eco']
                                    .children['goat']
                                    .children['hat1'];

                childNode.on("anEvent", function () {
                    eventArg = arguments[0];
                });

                foo.broadcast("anEvent", "foo");
            });
            it("should fire event on child node", function () {
                expect(eventArg).toBe("foo");
            });
        });

        /*
            unwrapping a node means extracting out the original
            'Plain Old Javascript Object' out of the Node object
        */
        describe("unwrapping a node", function () {

            var unwrapped;

            beforeEach(function () {

                unwrapped = foo.unwrap();
            });

            it("should return original pojso", function () {
                expect(unwrapped).toEqual({
                    bar : {

                        dan1 : "dan1",
                        dan2 : "dan2",

                        eco : {
                            goat : {
                                hat1 : "hat1",
                                hat2 : "hat2"
                            }
                        }
                    }
                });
            });
        });

        /*
            setting a value off a child node should result in a 'change' event being fired on that node.
            the event should bubble up the node tree and result in handlers on parent elements
            registered for the change event being called.
        */
        describe("When value of a child node is set", function () {

            var result1, result2;

            beforeEach(function () {

                foo.on("change", function (newValue, oldValue) {

                    result1 = newValue;
                    result2 = oldValue;
                });
                foo.children['bar'].children['eco'].children['goat'].children['hat1'].set('anotherHat');
            });
            it("should call handler registered on parent node", function () {

                expect(result1).toBe("anotherHat");
                expect(result2).toBe("hat1");
            });
        });

        /* when a new node is created, a 'create' event should be fired */
        describe("When a new value node is created", function () {

            var newNode;

            beforeEach(function () {

                foo.on("create", function (node) {
                    newNode = node;
                });

                foo.children['bar'].children['eco'].createChild("hello", "world");
            });

            it("should insert node into json", function () {

                expect(foo.children['bar'].children['eco'].children['hello'].value).toBe("world");
            });

            it("should fire 'create' event", function () {

                expect(newNode.value).toBe("world");
            });

        });
        /*
            nodes can be object nodes or value node. A value node simply has a value and is
            a 'leaf' node. Object nodes contain other nodes
        */
        describe("When an object node is created", function () {

            var newNode

            beforeEach(function () {

                foo.on("create", function (node) {
                    newNode = node;
                });

                foo.children['bar'].children['eco'].createChild("hello", {

                    moo : {

                        pin : "pin"
                    }
                });

            });

            it("should fire 'create' event", function () {

                expect(newNode.children['moo'].children['pin'].value).toBe("pin");

            });

            /*
                When a node is delete, it should fire a 'delete' event
            */
            describe("deleting node", function () {

                var deletedNode;

                beforeEach(function () {

                    foo.on("delete", function (node) {
                        deletedNode = node;
                    });
                    foo.children['bar'].children['eco'].deleteChild("hello");
                });

                it("should delete node", function () {

                    expect(foo.children['bar'].children['eco'].children["hello"]).toBe(undefined);
                });

                it("should fire 'delete' event", function () {

                    expect(deletedNode.name).toBe("hello");
                });
            });
        });
    });
});
