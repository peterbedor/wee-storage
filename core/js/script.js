Wee.fn.make('storage', {
	get: function(key) {
		return this.$private.get(key);
	},

	set: function(key, val, type) {
		this.$private.set(key, val, type);
	},

	update: function(key, val, type) {
		this.$private.update(key, val, type);
	},

	delete: function(key) {
		this.$private.delete(key);
	},

	push: function(key, val) {
		this.$private.push(key, val);
	}
}, {
	_construct: function(type) {
		var storageType =
			! type ? 'sessionStorage' : type + 'Storage';

		this.storage = window[storageType];
	},

	get: function(key, full) {
		if (full) {
			key = key.split('.');

			return this.processGet(key[0]);
		}

		if (this.isDeep(key)) {
			return this.processDeepGet(key);
		} else {
			return this.processGet(key);
		}
	},

	set: function(key, val, type) {
		if (this.isDeep(key)) {
			this.setDeep(key, val, type);
		} else {
			this.storage.setItem(key, this.processSetVal(val, type));
		}
	},

	setDeep: function(key, val, type) {
		var obj = this.get(key, true);

		key = key.split('.');

		key.reduce(function(prev, cur, i, arr) {
			var isLast = (i === arr.length - 2);

			if (isLast) {
				return (prev[cur] = val);
			}
			
			return ($.isObject(prev[cur])) ? prev[cur] : (prev[cur] = {});
		}, obj);

		console.log(obj);
	},

	update: function(key, val, type) {
		//
	},

	delete: function(key) {
		//
	},

	push: function(key, val) {
		//
	},

	isDeep: function(key) {
		return key.indexOf('.') > 0;
	},

	processSetVal: function(val, type) {
		type = this.getType(val, type);

		return JSON.stringify({
			type: type,
			val: val
		});
	},

	processGet: function(key) {
		var val = JSON.parse(
			this.storage.getItem(key)
		);

		if (val.val) {
			return val.val;
		}

		return val;
	},

	processDeepGet: function(key) {
		key = this.processKey(key);

		var keyArray = key.split('.'),
			obj = this.get(keyArray[0]),
			len = keyArray.length,
			i = 1;

		for (; i < len; i++){
			obj = obj[keyArray[i]];
		}

		return obj;
	},

	getType: function(val, type) {
		type = type || null;

		if (type === null || ! this.validateType(type)) {
			if ($.isString(val)) {
				type = 'string';
			} else if ($.isArray(val)) {
				type = 'array';
			} else if ($.isObject(val)) {
				type = 'object';
			} else if ($.isFunction(val)) {
				type = 'function';
			} else if (typeof val == 'number') {
				type = 'number';
			}
		}

		return type;
	},

	processKey: function(key) {
		// Convert indexes to properties
		key = key.replace(/\[(\w+)\]/g, '.$1');

		// Strip leading dot
		key = key.replace(/^\./, '');

		return key;
	},

	validateType: function(type) {
		return type.match(/(^string$|^array$|^object$|^function$)/g);
	}
}, {
	instance: false
});