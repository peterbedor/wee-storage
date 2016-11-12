Wee.fn.make('storage', {
	/**
	 * @param {string} key
	 * @param {*} value
	 */
	set: function(key, value) {
		this.$private.set(key, value);
	},

	/**
	 * @param {string} key
	 * @returns {*}
	 */
	get: function(key) {
		return this.$private.get(key);
	},

	/**
	 * @param {string} key
	 */
	delete: function(key) {
		this.$private.delete(key);
	},

	/**
	 * @param {string} key
	 * @param {*} value
	 */
	push: function(key, value) {
		this.$private.push(key, value);
	}
}, {
	/**
	 * Constructor
	 *
	 * @param {string} type - type of storage
	 * @private
	 */
	_construct: function(type) {
		var storageType =
			! type ? 'sessionStorage' : type + 'Storage';

		this.storage = window[storageType];
	},

	/**
	 * @param {string} key
	 * @param {*} value
	 */
	set: function(key, value) {
		var segments = key.toString().split('.');

		if (segments.length > 1) {
			var firstKey = segments.shift(),
				lastKey = segments.pop(),
				data = this.getData(firstKey);

			if (data) {
				if (data.hasOwnProperty(lastKey)) {
					data[lastKey] = value;

					this.set(firstKey, data);
				}
			}
		} else {
			value = this.processValue(value);

			this.storage.setItem(key, value);
		}
	},

	/**
	 * @param {string} key
	 * @returns {*}
	 */
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

	/**
	 * @param {string} key
	 */
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

	/**
	 * @param {string} key
	 * @param {*} value
	 */
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

	/**
	 * @param {string} key
	 * @param {*} value
	 * @param {array} segments
	 */
	pushNested: function(key, value, segments) {
		var firstKey = segments.shift(),
			lastKey = segments.pop(),
			data = this.getData(firstKey);

		if (data.hasOwnProperty(lastKey) && $.isArray(data[lastKey])) {
			data[lastKey].push(value);

			this.set(firstKey, data);
		}
	},

	/**
	 * Retrieve data from storage.  This function will attempt to parse
	 * the data into JSON.
	 *
	 * @param {string} key
	 * @returns {string|boolean|*}
	 */
	getData: function(key) {
		var data = this.storage.getItem(key);

		if (data) {
			try {
				data = JSON.parse(data);
			} catch (e) {}

			return data;
		}

		return false;
	},

	/**
	 * Attempt to stringify value before storing it
	 *
	 * @param {*} value
	 * @returns {*}
	 */
	processValue: function(value) {
		try {
			value = JSON.stringify(value);
		} catch(e) {}

		return value;
	}
});