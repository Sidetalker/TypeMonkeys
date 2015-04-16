// Allow proper redirection of #-hrefs in tab bars
$(function(){
	var hash = window.location.hash;
	hash && $('ul.nav a[href="' + hash + '"]').tab('show');

	$('.nav-tabs a').click(function (e) {
		$(this).tab('show');
		var scrollmem = $('body').scrollTop();
		window.location.hash = this.hash;
		$('html,body').scrollTop(scrollmem);
	});
});

// Extension to check if two arrays are identical
Array.prototype.same = function() {
    for(var i = 1; i < this.length; i++) {
        if(this[i] !== this[0])
            return false;
    }

    return true;
}