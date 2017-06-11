/**
 * Check the page is visible or hidden (tab is active or inactive)
 */
var vis = (function(){
    var stateKey, eventKey, keys = {
        hidden: "visibilitychange",
        webkitHidden: "webkitvisibilitychange",
        mozHidden: "mozvisibilitychange",
        msHidden: "msvisibilitychange"
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
 * Fetch data from json file
 */
function fetchData() {
    $.ajax( {
        url: "https://raw.githubusercontent.com/kienle83/centerpage/master/data/data.json",
        type: 'GET',
        success: function( data ) {
            var parsed = JSON.parse(data);
            //var timestamp = "2017-06-08T21:34:39.244341+00:00";
            var timestamp = "2017-06-09T21:34:39.244341+00:00";

            if (parsed.last_published_semantic && timestamp !== parsed.last_published_semantic) {
                //console.log(parsed.last_published_semantic);
                showOverlay();
            }
        },
        error: function() {
            console.log("error");
            //setTimeout();
        }
    });
}

/**
 * Show overlay
 */
function showOverlay() {

    var $overlayWrapper = $("#overlay-wrapper");

    if ($overlayWrapper.not(":visible")) {
        $( "#overlay-wrapper" ).dialog({
            resizable: false,
            height: "auto",
            width: 400,
            modal: true,
            buttons: {
                "Neu laden": function() {
                    location.reload();
                    //$( this ).dialog( "close" );
                },
                "Abbrechen": function() {
                    $( this ).dialog( "close" );
                }
            }
        });
    }

}


/**
 * Bind events depend on visible/hidden page
 */
vis(function(){

    if (vis()) {
        console.log("document is visible");
        document.title = 'Visible';
        //bindResetEvents();
        fetchData();
    } else {
        console.log("document is hidden");
        document.title = 'Not visible';
        //unbindResetEvents();
    }

});
