(function($) {
    var defaults = {
        currentPage: 1,
        isLoading: false,
        isFinished: false,
        fireSelector: '.spinner',
        nextPageUrlBase: '/page',
        totalPages: 0
    };
    
    var previews = [];
    
    var methods = {
        init: function (options) {
            var options = $.extend({}, defaults, options);
            
            var that = this;

            $(window).scroll(function() {
                if ($(this).scrollTop() > ($(options.fireSelector).offset().top +
                                       $(options.fireSelector).outerHeight() -
                                       $(window).height())) {
                    methods.loadMore.call(that, options);
                }
            });
        },
        
        loadMore: function(options) {
            if (options.currentPage === options.totalPages) {
                options.isFinished = true;
                $(options.fireSelector).fadeTo(200, 0);
            }
            
            if (!options.isFinished && !options.isLoading) {
                options.currentPage++;
                options.isLoading = true;

                $('.posts').append('<div class="posts"></div>');
                $('.posts').last().load(options.nextPageUrlBase + options.currentPage + '/ .posts', function(response, status, xhr) {
                    setTimeout(function() {
                        options.isLoading = false;
                    }, 1000);
                });
            }
        }
    };
    
    $.fn.infiniteScroll = function(methodOrOptions) {
        if (methods[methodOrOptions]) {
            return methods[methodOrOptions].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof methodOrOptions == 'object' || !methodOrOptions) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + methodOrOptions + 'does not exists on jQuery.tooltip');
        }
    };
}(jQuery));