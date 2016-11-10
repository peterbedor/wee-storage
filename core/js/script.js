Wee.fn.make('storage', {
	set: function(key, value) {
		this.$private.set(key, value);
	},

	get: function(key) {
		return this.$private.get(key);
	},

	delete: function(key) {
		this.$private.delete(key);
	},

	push: function(key, value) {
		this.$private.push(key, value);
	}
}, {
	_construct: function(type) {
		var storageType =
			! type ? 'sessionStorage' : type + 'Storage';

		this.storage = window[storageType];
	},

	set: function(key, value) {
		var segments = key.toString().split('.');

		if (segments.length > 1) {
			var firstKey = segments.shift(),
				lastKey = segments.pop(),
				data = this.getData(firstKey);

			if (data.hasOwnProperty(lastKey)) {
				data[lastKey] = value;

				this.set(firstKey, data);
			}
		} else {
			value = this.processValue(value);

			this.storage.setItem(key, value);
		}
	},

	get: function(key) {
		var segments = key.toString().split('.'),
			data = this.getData(segments.shift()),
			i = 0;

		if (data) {
			for (; i < segments.length; i++) {
				data = data.hasOwnProperty(segments[i]) ?
					data[segments[i]] : null;
			}
		}

		return data;
	},

	delete: function(key) {
		var segments = key.toString().split('.');

		if (segments.length > 1) {
			var firstKey = segments.shift(),
				lastKey = segments.pop(),
				data = this.getData(firstKey);

			if (data.hasOwnProperty(lastKey)) {
				delete data[lastKey];

				this.set(firstKey, data);
			} else {
				return false;
			}
		}

		this.storage.removeItem(key);
	},

	push: function(key, value) {
		var segments = key.toString().split('.'),
			data = this.get(key);

		if (segments.length > 1) {
			this.pushNested(key, value, segments);
		} else {
			if ($.isArray(data)) {
				data.push(value);

				this.set(key, data);
			}
		}
	},

	pushNested: function(key, value, segments) {
		var firstKey = segments.shift(),
			lastKey = segments.pop(),
			data = this.getData(firstKey);

		if (data.hasOwnProperty(lastKey) && $.isArray(data[lastKey])) {
			data[lastKey].push(value);

			this.set(firstKey, data);
		}
	},

	getData: function(key) {
		var data = this.storage.getItem(key);

		try {
			data = JSON.parse(data);
		} catch (e) {}

		return data;
	},

	processValue: function(value) {
		try {
			value = JSON.stringify(value);
		} catch(e) {}

		return value;
	}
});