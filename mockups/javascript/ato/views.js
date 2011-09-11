/*
	views.js
	Holds specialized views for objects, which are picked by name at render time
	for those objects.
	
	@date 24 July 2011
	@author Jake Teton Landis <just.1.jake@gmail.com>
*/

// ato global namespace
var ato;
if (typeof ato === 'undefined') ato = {};


/* special view constructors
 * selected based on the name of the object.
 * called with 3 parameters:
	* the object to build the view for
	* the object's deduced name, from the viewForObject function
	* the $result jQuery/HTML <section>, whith whatever viewForObject 
	  constructed before it passed off to the special constructor.
	* root data object
 */
ato.views = {
	object: function(obj, path, root, isForm, $result) {
		var name, type;
		$result =  $('<section/>');
		
		// find object name and type
		if (path[path.length - 1]) {
			// there are items in the path

			// name prefers the last value of the path over the name key in 
			// the object, because the name key in the object sometimes 
			// specifies object type
			if (!(parseFloat(path[path.length - 1])) ) {
				// we have a path, and the last value is not a parsable number
				// this means that it's a string, and a good name!
				name = path[path.length - 1]
			} else if (typeof obj.name !== 'undefined') {
				// the object has a 'name' key, which is a good name!
				name = obj.name
			}
			// type prefers the name key in the object, because the path name 
			// is usually for display purposes
			if (typeof obj.name !== 'undefined') {
				type = obj.name
			} else if (!(parseFloat(path[path.length - 1])) ) {
				type = path[path.length - 1]
			}
		}
		// the old way (before 5 September 2011) prefered obj.name over the path
		// objName = (obj.name) ? obj.name : objName;
		if (typeof name === 'string') {
			// use jQuery clone to create a heading for the object's section
			// from a template DOM element with prebound event handlers
			$result
				.attr('title', name)
				.append(
					ato.pane.h1template
						.clone(true)
						.text(name)
						.append(ato.pane.disclosure.clone())
				);
		}
		
		if (ato.views[type]) {
			// if we have a special view builder function for this object 
			// use that instead.
			// note that objects must have unique paths, but not unique obj.names
			// which is to say:
				// someUniqueName: {name: "dropdown", ... } // this is ok. SomeUniqueName is used in path building, not "dropdown"
			return ato.views[type](obj, path, root, isForm, $result);
		}
		
		// generic view builders for key-value dictionaries and lists
		if (ato.typeof(obj) === "[object Object]") {
			return ato.views.dictionary(obj, path, root, isForm, $result);
		} else if (ato.typeof(obj) === "[object Array]") {
			return ato.views.list(obj, path, root, isForm, $result);
		}
		
		return $result;
	}
	, dictionary: function(obj, path, root, isForm, $result) {
		for (key in obj) {
		    if (obj.hasOwnProperty(key) && !ato.pane.isExcluded(key) ) { 
			// exclude name
				// we have a good key: value pair and should build a view for it.
				if (typeof obj[key] === 'object'  ) {
					// recursivly handle objects & arrays
					$result.append( ato.views.object(obj[key], path.concat(key), root, isForm) )
				} else if (typeof obj[key] === 'string' && obj[key].length > 200) {
					// long strings get thier own section so they can expand/contract
					$result.append( $('<section class="string" title="'+key+'"><h1>'+key+'</h1>'+function(isForm){
						if (isForm) {
							return '<textarea name="'+ato.path.build(path.concat(key))+'">'+obj[key]+'</textarea>';
						}
						return '<p>'+obj[key]+'</p>';
					}()+'</section>') );
				} else {
					// add a dt+dd pair to a defenition list at the end of the obj
					if ( !$result.children().get(-1) || $result.children().get(-1).nodeName.toLowerCase() !== 'dl' ) {
						// if the last child of $result is not a dl, we need to add one
						$result.append( $('<dl />'));
					}
					// trinary operators FTW
					$result.children().eq(-1).append( $('<dt>'+( (isForm) ? ato.form.label(key, path) : key )+'</dt>'+
					'<dd title="'+key+'">'+( (isForm) ? ato.form.input(key, path, obj[key]) : obj[key] )+'</dd>') );
				}
			}
		}
		return $result;
	}
	, list: function(obj, path, root, isForm, $result) {
		var $list = $('<ol/>');
		for (var i = obj.length - 1; i >= 0; i--){ // reverse loop is faster in JS
			$list.prepend('<li/>');

			if (typeof obj[i] === 'object'  ) {
				// recursivly handle objects
				$list.children('li:first').append( ato.views.object(obj[i], path.concat(i), root, isForm) );
			} else if (typeof obj[i] === 'string' && obj[i].length > 200) {
				// long strings get thier own section so they can expand/contract
				if (isForm) {
					$list.children('li:first').append( $('<textarea name="'+ato.path.build(path.concat(i))+'">'+obj[i]+'</textarea>') );
				} else {
					$list.children('li:first').append( $('<p>'+obj[i]+'</p>') );
				}
			} else {
				if (isForm) {
					$list.children('li:first').append( ato.form.input(i, path, obj[i]) );
				} else {
					$list.children('li:first').append( obj[i] );
				}
			}
		};
		$result.append($list);
		return $result;
	}
	, dropdown: function(obj, path, root, isForm, $result) {
		if (isForm) {
			// Draw dropdown menu
			var $select = $("<select/>").attr('name', ato.path.build(path.concat('selected')))
			var $metadata = $("<div/>").addClass("metadata");
			for (var i = obj.choices.length - 1; i >= 0; i--){
				var option;
				if (ato.typeof(obj.choices[i]) === "[object Object]") {
					// this is a choice with a different visual text label from its value
					option = $("<option>" + obj.choices[i].text + "</option>").attr('value', obj.choices[i].value);
					$metadata.prepend( ato.form.input(['choices', i, 'text'], path, obj.choices[i].text, 'hidden') );
					$metadata.prepend( ato.form.input(['choices', i, 'value'], path, obj.choices[i].value, 'hidden') );
				} else {
					// the name is the value
					option = $("<option>" + obj.choices[i] + "</option>").attr('value', obj.choices[i]);
					$metadata.prepend( ato.form.input(['choices', i], path, obj.choices[i], 'hidden') );
					
				}
				// handle pre-selection
				if (option.attr('value') === obj.selected) {
					option.attr('selected', true);
				}
				
				$select.prepend(option);
				$metadata.prepend( ato.form.input(['choices', i, 'text'], path, obj.choices[i].text, 'hidden') )
			};
			$result.addClass('dropdown').append($select)
			// add metadata
			//input: function(key, fullpath, value, inputtype) 
			$result.append( $metadata );
			
		} else {
			// then this is just a normal text string in an array view or a list
			$result.empty()
			o = {}
			o[path[path.length -1]] = obj.selected;
			$result = ato.views.dictionary(o, path, root, false, $result);
		}
		return $result;
	}
	
	// Special views
	, images: function(obj, path, root, isForm, $result) {
		var colorForId = function(id, store) {
			// abstract one level because we might switch JSONpath out for jLinq or something later
			return jsonPath(store, '$.colors[?(@.id==='+id+')]')[0];
		}
		
		var c, $list = $('<ol/>');
		for (var i=0; i < obj.length; i++) {
			c = colorForId(obj[i].colorid, root);
			$list.append(
				// derp. @TODO move template code to external file
				// or @TODO ask what Seth thinks about templating in JS or django
				"<li>\n" +
					'<figure>'+
						'<figcaption><div class="swatch" style="background-color: #'+c.hex+';" />'+c.name+'</figcaption>'+
						'<img src="'+obj[i].uri+'" alt="Image ID: '+obj[i].id+'" /></figure>' +
				'</li>'
				
			);
		};
		
		return $result.append($list);
	}
	/*
		@TODO think about generalizing table generation
		right now its not worth it in terms of increased complexity vs
        maintanability
	*/
	, colors: function(obj, path, root, isForm, $result) {
		var $table = $('<table />');
		for (var i = obj.length - 1; i >= 0; i--){
			$table.prepend('<tr/>');
			
			// swatches
			$table.find('tr:first').append('<td title="swatch"/>');
			$('<div class="swatch"/>').css({
				  'background-color': '#'+obj[i].hex
				// style with JS until css is written
				, 'width': 10
				, 'height': 10
			}).appendTo( $table.find('tr:first').children(':last') );
			
			// Name
			$table.find('tr:first').append('<td title="name">'+obj[i].name+'</td>');
			
			// Explicit hex value
			$table.find('tr:first').append('<td title="hex">#'+obj[i].hex+'</td>');
		};
		return $result.append($table);
	}
	, sizes: function(obj, path, root, isForm, $result) {
				
		var $table = $('<table/>');
		// fast (reverse) loop so we use prepend
		for (var i = obj.length - 1; i >= 0; i--){
			$table.prepend(
			$("<tr title=\"size "+obj[i].name+"\">\n"+
				"<td class=\"name\">"+((isForm) ? ato.form.input([i, 'name'], path, obj[i].name) : obj[i].name)+"</td>\n"+
				"<td class=\"quantity\">"+((isForm) ? ato.form.input([i, 'quantity'], path, obj[i].quantity, 'number') : obj[i].quantity)+"</td>\n"+
			"</tr>").data('array-index', i)
			);
		};
		// add header row and return
		$result.append( $table.prepend('<tr class="header"><th>Size</th><th>Quantity</th></tr>') );
		
		if (isForm) {
			$result.append(
				$('<a class="button" href="##">Add New Size</a>').click(function(e){
					e.preventDefault();
					
					var t = $(this).siblings('table:first');
					var index = t.find('tr').length - 1;
					t.append( '<tr title="new size"><td class="name">'+ato.form.input([index, 'name'], path)+'</td><td class="quantity">'+ato.form.input([index, 'quantity'], path, '', 'number')  );
				})
			);
		}
		
		return $result;
	}
}
