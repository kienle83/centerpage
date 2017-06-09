
/** Custom function */
urlParam = function(name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results == null) {
        return null;
    } else {
        return results[1] || 0;
    }
}

getKeywords = function(param) {
    param = param.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    param = param.replace(/\\u[\dA-F]{4}/gi, function(match) {
        return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
    });
    return param;
}
/*********************/

var q = urlParam('q');
var lowPrice = urlParam('low-price');
var highPrice = urlParam('high-price');

if (q !== null && typeof(q) !== 'undefined' && q != 0) {
    var searchVal = decodeURIComponent(q.replace(/\+/g, ' '));
    $('#keywords').html(searchVal);
    $('#search-form-input').val(searchVal);

    var priceFilter = false;

    if (!(isNaN(parseFloat(lowPrice)) || isNaN(parseFloat(highPrice)))) {

        priceFilter = true;

        lowPrice  = parseFloat(lowPrice);
        highPrice = (highPrice != 0) ? parseFloat(highPrice) : '';

        $('#low-price').val(lowPrice);
        $('#high-price').val(highPrice);

        var priceRange = (highPrice != '') ? (lowPrice + ' - ' + highPrice) : ('from ' + lowPrice);
        $('#price-range').html(priceRange);

    }

    $.ajax( {
        url: "https://raw.githubusercontent.com/kienle83/search/master/data/data.json",
        type: 'GET',
        success: function(data) {
            var parsed = JSON.parse(data),
                tours = parsed.tours,
                results = [];

            for (var i = 0 ; i < tours.length ; i++)
            {
                var title = tours[i].title;
                var price = tours[i].price;

                title = getKeywords(title);
                price = parseFloat(price);

                if (priceFilter) {
                    if (highPrice != '') {
                        if (title.toLowerCase().indexOf(searchVal.toLowerCase()) >= 0 && (lowPrice <= price && price <= highPrice)) {
                            results.push(tours[i]);
                        }
                    } else if (title.toLowerCase().indexOf(searchVal.toLowerCase()) >= 0 && lowPrice <= price) {
                        results.push(tours[i]);
                    }
                } else if (title.toLowerCase().indexOf(searchVal.toLowerCase()) >= 0) {
                    results.push(tours[i]);
                }
            }

            var html  = '',
                count = results.length;

            for (var j = 0; j < count; j++) {
                html += '<div class="card"><div class="card-block"><h4 class="card-title">' + results[j].title + '</h4><h6 class="card-subtitle mb-2 text-muted">Rating: ' + results[j].rating + '</h6><p class="card-text">Price: ' + results[j].price + ' ' + results[j].currency + '</p><a href="#" class="card-link">See more</a></div></div>';
            }

            $('#result-count').text(count);
            $('#result-box').html(html);
        }
    });
}

$('#search-form-input').autocomplete({
    source: function(request, response) {
        $.ajax( {
            url: "https://raw.githubusercontent.com/kienle83/search/master/data/data.json",
            type: 'GET',
            success: function(data) {
                var parsed = JSON.parse(data),
                    tours = parsed.tours,
                    results = [],
                    searchVal = request.term;

                for (var i = 0 ; i < tours.length ; i++)
                {
                    var title = tours[i].title;
                    title = getKeywords(title);

                    if (title.toLowerCase().indexOf(searchVal.toLowerCase()) >= 0) {
                        results.push(title);
                    }
                }

                if (results.length >= 5)
                    results = results.slice(0, 5);

                response(results);
            }
        });
    },
    select: function( event, ui ) {
        $('#search-form-input').val(ui.item.value);
        $('#search-header').submit();
    }
});