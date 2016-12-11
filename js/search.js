function displaySearchResults(results, store) {
    var searchResults = document.getElementById('search-results');

    if (results.length) {
        var appendString = '';

        results.forEach(function(result) {
            var item = store[result.ref];

            appendString += '<li class=\'item\' role=\'listitem\'><a href=' + item.url + ' role=\'link\' aria-labelledby=\'Link to this post\'>' + item.title + '</a>';

            if (item.content) {
                appendString += '<p class=\'mui-p\' aria-labelledby=\'Post content preview\'>' + item.content.substring(0, 150) + '...</p>';
            }

            appendString += '</li>';
        });

        searchResults.innerHTML = appendString;
    } else {
        searchResults.innerText = 'No results found';
    }
}


function getQueryVariable(variable) {
    var query = window.location.search.substring(1),
        vars  = query.split('&');

    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');

        if (pair[0] === variable) {
            return decodeURIComponent(pair[1].replace(/\+/g, '%20'));
        }
    }
}


var searchTerm = getQueryVariable('query');


if (searchTerm) {
    document.getElementById('search-input').setAttribute('value', searchTerm);

    var idx = lunr(function () {
        this.field('id');
        this.field('title', { boost: 10 });
        this.field('category');
        this.field('content');
    });

    for (var key in window.store) {
        idx.add({
            'id': key,
            'title': window.store[key].title,
            'category': window.store[key].category,
            'content': window.store[key].content
        });

        var results = idx.search(searchTerm);

        displaySearchResults(results, window.store);
    }
}
