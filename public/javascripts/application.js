// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

scope = '';
cat = '';

$(document).ready(function() {
  $('#scope-' + scope).addClass('active');
  $('#posts-' + cat).addClass('active');

	$('#ajax_map').click(function(){
		alert("hello world");
		$('#map_container').addClass('map_container');
		$('#gmaps4rails_map').addClass('gmaps4rails_map');
		Gmaps4Rails.initialize();
		Gmaps4Rails.direction_conf.origin = 'toulon, france';
		Gmaps4Rails.direction_conf.destination = 'paris, france';
		Gmaps4Rails.create_direction();
	});

	$('#post_category').change(function(){
		if ($(this).val() == 'Shout') {
			$('.notForShout').hide();
			$('[for=post_description]').text('Message');
			$('#post_post_type').val('Offer');
			$('#post_item').text(' ');
		} else {
			$('.notForShout').show();
			$('[for=post_description]').text('Description');
			$('#post_post_type').val('');
			$('#post_item').text('');
		}
	});
});