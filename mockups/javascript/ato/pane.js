/*
	pane.js
	Handles the basic construction of all views and forms in the right-hand pane.
	
	@date 24 July 2011
	@author Jake Teton Landis <just.1.jake@gmail.com>
*/

// ato global namespace
if (typeof ato === 'undefined') ato = {};

// .pane function subspace
ato.pane = {
	// spinner group to be displayed while we wait for AJAX requests to
	// come back.
	  spinner: $('<div id="waitingNotification"><h3>Loading</h3><img src="images/waiting.gif" class="spinner" alt="Please wait"/></div>')
	// h1 element with pre-bound event handlers that we clone when creating object representations
	, h1template: $('<h1/>').click( function(e){
		if ( ($(this).siblings().length > 1) || ($(this).next()[0].nodeName.toLowerCase() === 'table' ) ) {
			// we need to put the siblings in an anonymous container div
			$('<div class="cleafix" />').append($(this).siblings()).appendTo( $(this).parent() );
		}
		console.log('clicked h1');
		$(this).next().slideToggle('slow');
		$(this).children('.disclosure').toggleClass('closed');
	})
	, disclosure: $('<div class="disclosure">▼</div>')
	, exclude: ['id'] // list of (top-level) keys to exclude from views/forms in the pane
	, CURRENT: {}
	, sanitize: function(val) {
		// ABSTRACT ONE LEVEL!!!
		return ato.HtmlEncode(val);
	}
	/* @function isExcluded
	 * @parameter: key (string)
	 * Checks if the string is in ato.EXCLUDE
	 */
	, isExcluded: function( key ) {
		if (ato.pane.EXCLUDE.indexOf(key) === -1 ) return false;
		return true;
	}
	/* @function ready
	 * does final setup when all required components are loaded.
	 * I reccomend you call at the start of your jquery().ready block,
	 * but after you declare your ato settings like ato.USE
	 */
	, ready: function() {
		ato.log('Welcome to At Once, version ', ato.version)
		if (typeof ato.USE === 'undefined') {
			console.log('WARNING: ato.USE undefined');
		} else {
			// yay, ato.USE is defined and everything is going smoothly.
			if (ato.typeof(ato[ato.USE].exclude) === '[object Array]' ) {
				ato.pane.EXCLUDE = ato.pane.exclude.concat( ato[ato.USE].exclude )
			}
			else {
				ato.log('No exclude settings defined for ', ato.USE)
				ato.pane.EXCLUDE = ato.pane.exclude;
			}
		}
	}
	
	, showId: function(itemId) {			
		// grab information from #table to use while our AJAX gets the JSON
		var $row = $('#table tbody').children().eq(itemId).children();
		var $header = $('#table table .header').children();
		var tempInfo = {};
		for (var i = $row.length - 1; i >= 0; i--){
			// reades the key names from the table header, and the values from the row itself
			tempInfo[ $header[i].innerText.toLowerCase() ] = $row[i].innerText;
		};
		// populate the sidebar using the temporary information
		ato.pane.populate(tempInfo);
		
		// start the spinner working
		ato.pane.$.children('.wrapper').append(ato.pane.spinner);
		
		// AJAX load JSON describing our id
		// simulated using setTimeout
		setTimeout(function() {ato.pane.showItemCallback(item)}, 50);
	}
	, showItemCallback: function(obj) {
		// @TODO check out the JSON response, make sure its good
		// ...
		
		// Set the current pane item
		ato.pane.CURRENT = new ato.item(obj);
		
		// populate the pane
		ato.pane.populate(obj);
	}
	, populate: function(obj, isForm) {
		var $view;
		// set header first
		// @TODO read the keynames of these things from an invisible form
		// ...or something
		if ( ato.USE && ato[ato.USE].headerSecondaryKey ) {
			ato.pane.$.find('header dd.secondary').text(obj[ato[ato.USE].headerSecondaryKey]);
		}
		ato.pane.$.find('header h1').text(obj.name);
		ato.pane.$.find('header dd.id').text(obj.id);
		
		$view = ato.views.object(obj, [], obj, isForm);
					
		// done populating
		// clear the pane
		ato.pane.$.children('.wrapper').children().remove()
		
		// remove the topmost h1 (we have the header for that)
		$view.children('h1').remove();
		
		// append view
		ato.pane.$.children('.wrapper').append(function(){
			if (isForm) {
				$view = $('<form title="'+$view.attr('title')+'"/>').append( $view.children() );
			}
			return $view;
		}());
		
		// show edit button
		ato.pane.$.find('header a[href=#edit]').show();
	}
	
}
