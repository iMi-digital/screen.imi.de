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

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


connection.session = {
    screen: true,
    oneway: true
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
