document.addEventListener('DOMContentLoaded', function() {
    var message = document.getElementsByClassName('hire')[0],
        showTimes = JSON.parse(localStorage.getItem('lfj2016'));

    if (!showTimes) {
        showTimes = 1;
        message.className += ' show animated';
    } else if (showTimes < 3) {
        showTimes++;
        message.className += ' show';
    }

    localStorage.setItem('lfj2016', JSON.stringify(showTimes));
});
