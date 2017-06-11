
var idleTime = 0;
var timestamp = null;
//timestamp = '2017-06-08T21:34:39.244341+00:00';
//timestamp = '2017-06-09T21:34:39.244341+00:00';


/**
 * Check the page is visible or hidden (tab is active or inactive).
 */
var vis = (function() {
    var stateKey, eventKey, keys = {
        hidden: 'visibilitychange',
        webkitHidden: 'webkitvisibilitychange',
        mozHidden: 'mozvisibilitychange',
        msHidden: 'msvisibilitychange'
    };
    for (stateKey in keys) {
        if (stateKey in document) {
            eventKey = keys[stateKey];
            break;
        }
    }
    return function(c) {
        if (c) document.addEventListener(eventKey, c);
        return !document[stateKey];
    }
})();

/**
 * Fetch data from json file.
 */
function fetchData() {
    $.ajax( {
        url: 'https://raw.githubusercontent.com/kienle83/centerpage/master/data/data.json',
        type: 'GET',
        success: function( data ) {
            var parsedData = JSON.parse(data),
                lastChange = parsedData.last_published_semantic;

            console.log('fetched data: ' + lastChange);

            if (lastChange && timestamp !== lastChange) {
                showOverlay();
                timestamp = lastChange;
            }
        },
        error: function() {
            console.log('error');
        }
    });
}

/**
 * Show overlay
 */
function showOverlay() {

    var $overlayWrapper = $('#overlay-wrapper');

    if ( ! $overlayWrapper.is(':visible') ) {
        $( '#overlay-wrapper' ).dialog({
            resizable: false,
            height: 'auto',
            width: 400,
            modal: true,
            buttons: {
                'Neu laden': function() {
                    location.reload();
                },
                'Abbrechen': function() {
                    $( this ).dialog( 'close' );
                }
            }
        });
    }

}

/**
 * Bind events depend on visible/hidden page.
 */
vis(function() {

    if ( vis() ) {
        console.log('document is visible');

        // if overlay is visible but user click away and come back to page then we do not need to fetch data.
        if ( ! $('#overlay-wrapper').is(':visible') ) {
            fetchData();
        }

    } else {
        console.log('document is hidden');
    }

});


/**
 * Check user idle on page, if user is idle after a period then we will fetch data.
 */

$(document).ready(function () {
    //Increment the idle time counter every minute.
    var idleInterval = setInterval(_timerIncrement, 6000); // 1 minute

    //Zero the idle timer on mouse movement.
    $(this).mousemove(function (e) {
        idleTime = 0;
    });
    $(this).keypress(function (e) {
        idleTime = 0;
    });
});

/**
 * If user is idle longer than 5 minutes then data will be fetched.
 */
function _timerIncrement() {
    idleTime = idleTime + 1;
    // 5 minutes
    if (idleTime > 5 && ! $('#overlay-wrapper').is(':visible')) {
        fetchData();
    }
}


