describe('sundry utils', function () {

  'use strict';

  var toArray, isObject, isString, isFunction, extend;

  beforeEach(function () {
    toArray = sundry.toArray;
    isObject = sundry.isObject;
    isString = sundry.isString;
    isFunction = sundry.isFunction;
    extend = sundry.extend;
  });

  describe('toArray()', function () {

    var result,
      arrayLike;

    beforeEach(function () {

      function makeArrayLike() {
        return arguments;
      }
      arrayLike = makeArrayLike('alpha', 'beta', 'gamma');
      result = toArray(arrayLike);

    });

    it('should return array', function () {
      expect(Array.isArray(result)).toBe(true);
      expect(Array.isArray(arrayLike)).toBe(false);

    });
  });

  describe('isObject()', function () {

  });

  describe('isString()', function () {

  });

  describe('isFunction()', function () {

  });

  describe('extend()', function () {
    var src1, src2, target, result;
    beforeEach(function () {
      target = {
        fruit : 'banana',
        vegetable : 'carrot'
      };
      src1 = {
        fruit : 'orange',
        foo : 'foo',
        moo : 'moo'
      };
      src2 = {
        fruit : 'apple',
        foo : 'fool',
        bar : 'bar',

      };

      result = extend(target, src1, src2);
    });

    it('should combine properties of src objects into target', function () {
      expect(target).toEqual({
        fruit : 'apple',
        vegetable : 'carrot',
        foo : 'fool',
        moo : 'moo',
        bar : 'bar'
      });

    });
    it('should return the target object', function () {
      expect(result).toBe(target);
    });
    it('should not change src objects', function () {
      expect(src1).toEqual({
        fruit : 'orange',
        foo : 'foo',
        moo : 'moo'
      });
      expect(src2).toEqual({
        fruit : 'apple',
        foo : 'fool',
        bar : 'bar'
      });
    });
  });
});
