document.addEventListener('DOMContentLoaded', function() {
    activateStickyAside();
});


function activateStickyAside() {
    var _      = Muilessium.UTILS;
    var EVENTS = Muilessium.EVENTS;

    var element = document.getElementById('aside-content');
    var rect = element.getBoundingClientRect();
    var position = window.pageYOffset + rect.top;
    var offset = 0;


    updateOffset();


    EVENTS.addEventListener('window-resize', updateSize);
    EVENTS.addEventListener('scroll-end', updateOffset);

    function updateSize() {
        rect = element.getBoundingClientRect();
        position = window.pageYOffset + rect.top;
    }


    function updateOffset() {
        rect = element.getBoundingClientRect();

        var minOffset = 0;
        var maxOffset = element.parentElement.getBoundingClientRect().height - rect.height - 20;

        if (window.innerWidth < 400) {
            offset = 0;
            element.style.transform = 'translateY(' + offset + 'px)';

            return;
        }

        if (rect.height > window.innerHeight) {
            var delta = (window.pageYOffset + window.innerHeight) - (position + rect.height);

            if (delta > 0) {
                offset = _.upperLimit(delta, maxOffset);

                element.style.transform = 'translateY(' + offset + 'px)';
            } else {
                delta = (position + offset) - window.pageYOffset;

                if (delta > 0) {
                    offset = _.lowerLimit(offset - delta, minOffset);

                    element.style.transform = 'translateY(' + offset + 'px)';
                }
            }
        }
    }
}

