// ......................................................
// .......................UI Code........................
// ......................................................


/*document.getElementById('open-or-join-room').onclick = function () {
 this.disabled = true;
 connection.openOrJoin(document.getElementById('room-id').value);
 };*/

// ......................................................
// ..................RTCMultiConnection Code.............
// ......................................................

var connection = new RTCMultiConnection();

connection.getExternalIceServers = false;
connection.iceServers = [];

// put your data in these 6-lines
var ident       = 'imidigital';
var secret      = '317d7ac2-dba1-11e5-bfdd-fd61327a0b0a';
var domain      = 'screen.imi.de';
var application = 'default';
var room        = 'default';
var secure      = '1';

function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
        xhr.open(method, url, true);
    } else if (typeof XDomainRequest != "undefined") {
        xhr = new XDomainRequest();
        xhr.open(method, url);
    } else {
        xhr = null;
    }
    return xhr;
}
var url = 'https://service.xirsys.com/ice';
var xhr = createCORSRequest('POST', url);
xhr.onload = function() {
    var iceServers = JSON.parse(xhr.responseText).d.iceServers;
    connection.iceServers = iceServers;
};
xhr.onerror = function() {
    console.error('Woops, there was an error making xhr request.');
};
xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

xhr.send('ident='+ident+'&secret='+secret+'&domain='+domain+'&application='+application+'&room='+room+'&secure='+secure);



function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


connection.session = {
    screen: true,
    oneway: true
};

connection.__getScreenConstraints = connection.getScreenConstraints;
connection.getScreenConstraints = function(callback) {
    connection.__getScreenConstraints(function(error, screen_constraints) {
        if (connection.DetectRTC.browser.name === 'Chrome') {
            delete screen_constraints.mandatory.minAspectRatio;
        }
        callback(error, screen_constraints);
    });
};

connection.sdpConstraints.mandatory = {
    OfferToReceiveAudio: false,
    OfferToReceiveVideo: false
};

var videosContainer = document.getElementById('videos-container');
connection.onstream = function (event) {
    videosContainer.appendChild(event.mediaElement);
};


joinRoom = function() {
    if ($('#room-id').val() == '') {
        window.alert('Bitte geben Sie zuerst den Code Ihres Partners ein.');
        return;
    }

    this.disabled = true;
    connection.join(document.getElementById('room-id').value);
}

if (window.location.hash) {
    $('#room-id').val(window.location.hash.substr(1));
    joinRoom();
}

document.getElementById('open-room').onclick = function () {
    if ($('#room-id').val() == '') {
        $('#room-id').val(getRandomInt(10000,99999));
    }

    roomId = $('#room-id').val();
    this.disabled = true;
    connection.open(roomId);

    var link = window.location.href + '#' + roomId;
    $('#shareLink').html(link);
    $('#shareLink').attr('href', link);

    $('.share-alert').fadeIn();
};


$('#join-room').click(joinRoom);
