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
});
