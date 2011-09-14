/*
 * 	Easy Paginate 1.0 - jQuery plugin
 *	written by Alen Grakalic	
 *	http://cssglobe.com/
 *
 *	Copyright (c) 2011 Alen Grakalic (http://cssglobe.com)
 *	Dual licensed under the MIT (MIT-LICENSE.txt)
 *	and GPL (GPL-LICENSE.txt) licenses.
 *
 *	Built for jQuery library
 *	http://jquery.com
 *
 */

(function($){$.fn.easyPaginate=function(_1){var _2={step:4,delay:100,numeric:true,nextprev:true,controls:"pagination",current:"current"};var _1=$.extend(_2,_1);var _3=_1.step;var _4,_5;var _6=$(this).children();var _7=_6.length;var _8,_9,_a;var _b=1;function _c(){_4=((_b-1)*_3);_5=_4+_3;$(_6).each(function(i){var _d=$(this);_d.hide();if(i>=_4&&i<_5){setTimeout(function(){_d.fadeIn("fast");},(i-(Math.floor(i/_3)*_3))*_1.delay);}if(_1.nextprev){if(_5>=_7){_9.fadeOut("fast");}else{_9.fadeIn("fast");}if(_4>=1){_a.fadeIn("fast");}else{_a.fadeOut("fast");}}});$("li","#"+_1.controls).removeClass(_1.current);$("li[data-index=\""+_b+"\"]","#"+_1.controls).addClass(_1.current);};this.each(function(){_8=this;if(_7>_3){var _e=Math.floor(_7/_3);if((_7/_3)>_e){_e++;}var ol=$("<ol id=\""+_1.controls+"\"></ol>").insertAfter(_8);if(_1.nextprev){_a=$("<li class=\"prev\">Previous</li>").hide().appendTo(ol).click(function(){_b--;_c();});}if(_1.numeric){for(var i=1;i<=_e;i++){$("<li data-index=\""+i+"\">"+i+"</li>").appendTo(ol).click(function(){_b=$(this).attr("data-index");_c();});}}if(_1.nextprev){_9=$("<li class=\"next\">Next</li>").hide().appendTo(ol).click(function(){_b++;_c();});}_c();}});};})(jQuery);