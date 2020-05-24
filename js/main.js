document.addEventListener('DOMContentLoaded', function() {
    var _      = Muilessium.UTILS;
    var EVENTS = Muilessium.EVENTS;


    showNavigation();


    function showNavigation() {
        var navigation = document.querySelector('.mui-header-navigation');
        var links      = navigation.querySelectorAll('.link');
        var hamburger  = navigation.querySelector('.-hamburger');

        EVENTS.addEventListener('muilessium-initialized', function() {
            setTimeout(function() {
                _.forEach(links, function(link) {
                    _.activateAnimation(link);
                }, 50);

                _.activateAnimation(hamburger);
            }, 1000);
        }, true);
    }
});

