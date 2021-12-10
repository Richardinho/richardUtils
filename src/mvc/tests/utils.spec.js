describe('utils', function() {

  describe('arrayPush()', function () {
    var arr, newArr;

    beforeEach(function(){
      arr = ['apple', 'banana'];
      newArr = utils.arrayPush(arr, 'carrot');
    });

    it('should return array with pushed item', function() {
      expect(newArr).toEqual(['apple', 'banana', 'carrot']);
    });

    it('should not alter original array', function() {
      expect(arr).toEqual(['apple', 'banana']);
    });
  });

  describe('removeArrayItem()', function () {
    var arr, newArr;

    beforeEach(function(){
      arr = ['apple', 'banana', 'carrot'];
      newArr = utils.removeArrayItem(arr, 1);
    });

    it('should return array without indexed item', function() {
      expect(newArr).toEqual(['apple', 'carrot']);
    });

    it('should not alter original array', function() {
      expect(arr).toEqual(['apple', 'banana', 'carrot']);
    });
  });
});
