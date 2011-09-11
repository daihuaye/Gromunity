/*
	core.js
	
	ato Javascript Core
		
	@date 24 July 2011
	@author Jake Teton-Landis <just.1.jake@gmail.com>
	
	ts=4;
*/

/*
 *	@namespace ato
 *	Holds our functions and global objects
 */
ato = { // that's right, it's global.
	  version: .1
	/* @function ato.log
	 * wraps console.log so it's safe to use in production.
	 * @arguments any and infinite.
	 */
	, log: {}
	
	/* @function ato.typeof
	 * returns ECMAScript standard types, so we can easily determine if an 
	 * object is an array.
	 */
	, typeof: function( value ) {
		return Object.prototype.toString.apply(value);
	}
	, isNumber: function(n) {
		return !isNaN(parseFloat(n)) && isFinite(n);
	}
	, copy: function(obj) {
		return jQuery.extend(true, {}, obj);
	}
	, HtmlEncode: function(string) {
		// use the browser to do our encoding work for us
		var el = document.createElement("div");
		el.innerText = el.textContent = string;
		string = el.innerHTML;
		delete el;
		return string;
	}
	, numberOrJSONString: function(val) {
		if (typeof val === 'number' || ato.isNumber(val)) {
			// as a number
			return parseFloat(val);
		} else {
			return JSON.stringify(val);
		}
	}
} 


ato.log = function() {
	ato.log.history = ato.log.history || [];   // store logs to an array for reference
	ato.log.history.push(arguments);
	if(window.console){
		// window.console.log.apply({}, Array.prototype.slice.call(arguments))
		window.console.log( Array.prototype.slice.call(arguments) );
	}
}

/* @class ato.data
	Stores object representations so we can convieniently view and modify their 
	properties via JSONpath.
*/

ato.path = {
	  _normalize: function(val) {
		if (typeof val !== 'string') {
			return ato.path.build(val);
		}
		return val
	}
	, escape: function(val, unescape) {
		// uses escape sequences to remove pesky characters
		var from = "unescaped", to = "escaped";
		var table = [
			  {unescaped: '"', escaped: "'"}
			, {unescaped: "@", escaped: "＠"}
		];
		if (unescape) {
			from = "escaped";
			to = "unescaped";
		}
		for (var i = table.length - 1; i >= 0; i--){
			val = val.replace( new RegExp(table[i][from], 'g'), table[i][to] );
		};
		return val;
	}
	, unescape: function(val) {
		return this.escape(val, true);
	}
	, build: function( pathArray ) {
		// return ['$'].concat(pathArray).join('.');
		pathArray = jQuery.map(pathArray, function(val){
			if (ato.isNumber(val)) {
				// numbers are thier own literals, so no need to quote them
				return parseFloat(val);
			}
			// quote via JSON and escape so we can use it in both JSONpath and HTML
			return ato.path.escape( JSON.stringify(val) );
		});
		return '$[' + pathArray.join('][') + ']';
	}
	, unbuild: function( pathString ) {
		// var r = pathString.split('.');
		var r = pathString.split('').slice(2, pathString.length - 1)
		r = r.join('').split('][')
		
		return jQuery.map( r, function(val){
			if (ato.isNumber(val)) return parseFloat(val);
			return JSON.parse( ato.path.unescape(val) );
		})
	}
	, query: function(obj, pathArrayOrQuery) {
		// protect refrences by using a copy
		return jsonPath(ato.copy(obj), ato.path._normalize(pathArrayOrQuery));
	}
	, queryNearestAncestor: function(obj, pathArray) {
		for (var i = pathArray.length; i >= 0; i--){
			if ( ato.path.query(obj, pathArray.slice(0, i)) ) {
				return pathArray.slice(0, i);
			}
		};
	}
}

ato.item = function(obj) {
	this.original = obj;
	this.current = ato.copy(obj)
	this.mutable = ato.copy(obj) // deep copy
	return this;
}
ato.item.prototype = {
	  type: 'item'
	// , _escape: function(val) {
	// 	// we're building a javascript string that will be eval()'d, so we need 
	// 	// to escape everything, except numbers, which are thier own literal.
	// 	if (typeof val !== 'number' ) return JSON.stringify(val);
	// 	return val;
	// }
	, _escapeAccessor: function(a) {
		// if ( ato.isNumber(a) ) return '['+a+']';
		// return '.'+a;
		return '['+ ato.numberOrJSONString(a) + ']';
	}
	, query: function(path, queryOriginal) {
		var obj = (queryOriginal) ? ato.copy(this.original) : ato.copy(this.current);
		return jsonPath(obj, ato.path.build(path));
	}
	, queryRawPath: function(path, queryOriginal) {
		var obj = (queryOriginal) ? ato.copy(this.original) : ato.copy(this.current);
		return jsonPath(obj, path);
	}
	, buildMutatorQuery: function(path, val) {
		return ato.path.build(path.slice(0, path.length - 1)) + "[(@"+ this._escapeAccessor(path[path.length - 1]) +"="+ ato.numberOrJSONString(val) +")]";
	}
	, queryOriginal: function(path) {
		return this.query(path, true);
	}
	, setPathToVal: function(path, val, o) {
		var ancestorPath = ato.path.queryNearestAncestor(this.mutable, path);
		if ( ancestorPath.length !== path.length ) {
			// add objects or arrays until defined ground reaches the tip of our desired array
			for (var i=ancestorPath.length; i < path.length-1; i++) {
				// ( ato.isNumber(expected[i+1]) ) ? [] : 0

				jsonPath(o || this.mutable, this.buildMutatorQuery( 
					  path.slice(0,i+1)
					, (ato.isNumber(path[i+1])) ? [] : {}
				));
			};
		} 
		try {
			jsonPath(o || this.mutable, this.buildMutatorQuery(path, val) );
		} catch(err) {
			//@TODO real validation
			alert('Invalid characters in field ' + path.slice(1, path.length).join(' > '));
		}
		return this;
	}
	, applySerializedForm: function(serial) {
		for (var i = serial.length - 1; i >= 0; i--){
			this.setPathToVal( ato.path.unbuild(serial[i].name), serial[i].value);
		};
		return this;
	}
	, cancel: function() {
		// cancels current changes to the item and rolls back to the last current version
		this.mutable = ato.copy(this.current);
		return this;
	}
	, commit: function() {
		// commits changes to current
		this.current = ato.copy(this.mutable);
		return this;
	}
	, serialize: function() {
		return JSON.stringify(this.mutable);
	}
}

ato.form = {
	  input: function(key, fullpath, value, inputtype) {
		return '<input name="'+ ato.path.build(fullpath.concat(key))+'"  type="'+ (inputtype || 'text') +'" value="'+(value || '')+'"/>';
	}
	, label: function(key, fullpath){
		return '<label for="'+ato.path.build(fullpath.concat(key))+'">'+key+'</label>';
	}
}

/*
	Each page has a second-level object that at least defines the secodary
	header key for use in the sidepane. The primary header key is always
	the database id.
	
	The rest of the scripts look to the constant set at ato.USE for which 
	second-level object they draw setting from. For example, to use the settings 
	for the products page:
		
		ato.USE = 'products';
*/
ato.products = {
	  headerSecondaryKey: 'style'
	, exclude: ['name', 'style']
}