describe('dom', function () {
	describe('delegate()', function () {
		var html, root, event, spyHandler;
		beforeEach(function () {
			html = ['<div id="ancestor">',
			          '<div id="target" class="target">',
			            '<div>',
			              '<div id="descendant"></div>',
			            '</div>',
			          '</div>',
			        '</div>'].join('');
			root = document.createElement('div');
			document.body.appendChild(root);
			root.innerHTML = html;

			descendant = document.getElementById('descendant');
			ancestor = document.getElementById('ancestor');
			target = document.getElementById('target');

			event = document.createEvent('Event');
			event.initEvent('click', true, true);
			spyHandler = jasmine.createSpy('spy');

			domutils.delegate(ancestor, 'click', '.target', spyHandler);
			descendant.dispatchEvent(event);

		});
		afterEach(function () {
			document.body.removeChild(root);
		});
		it('should..', function () {
			expect(spyHandler).toHaveBeenCalled();
		});
	});

	describe('searchAncestors()', function () {
		var html, root, descendant, ancestor, target, result;
		beforeEach(function () {
			html = ['<div id="ancestor">',
			          '<div id="target" class="target">',
			            '<div>',
			              '<div id="descendant"></div>',
			            '</div>',
			          '</div>',
			        '</div>'].join('');
			root = document.createElement('div');
			document.body.appendChild(root);
			root.innerHTML = html;

			descendant = document.getElementById('descendant');
			ancestor = document.getElementById('ancestor');
			target = document.getElementById('target');

			result = domutils.searchAncestors(descendant, '.target', ancestor);
		});
		afterEach(function () {
			document.body.removeChild(root);
		});
		it('should return target element between ancestor and descendant', function () {
			expect(result).toBe(target);
		});
	});

	describe('$()', function () {
		var html, root;
		beforeEach(function () {
			html = ['<div id="bar">',
			          '<div>',
			            '<div class="foo">foo</div>',
			          '</div>',
			        '</div>'].join('');
			root = document.createElement('div');
			document.body.appendChild(root);
			root.innerHTML = html;
		});

		afterEach(function () {
			document.body.removeChild(root);
		});
		describe('when only a selector is passed in', function () {
			it('should find element specified by selector', function () {
				expect(domutils.$('#bar .foo').innerHTML).toBe('foo'); // what is best way to get inner text of a node?
			});
		})
		describe('when selector and context are passed in', function () {
			it('should find element specified by selector within context', function () {
				expect(domutils.$('.foo', document.getElementById('bar')).innerHTML).toBe('foo'); // what is best way to get inner text of a node?
			});
		})
	});
});