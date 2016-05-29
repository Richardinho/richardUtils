describe('sundry utils', function () {

	var extend;

	beforeEach(function () {
		extend = sundry.extend;
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