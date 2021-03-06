// Initialize Firebase
// Set the configuration for your app
// TODO: Replace with your project's config object
var config = {
    apiKey: "AIzaSyDXIkU2-PoqMsmP3LN_nqt328gY25gfxvs",
    authDomain: "new-tab-1835f.firebaseapp.com",
    databaseURL: "https://new-tab-1835f.firebaseio.com",
    storageBucket: "new-tab-1835f.appspot.com"
};
firebase.initializeApp(config);
// Get a reference to the database service
var database = firebase.database();
// Get a reference to the storage service, which is used to create references in your storage bucket
var storage = firebase.storage();
// Create a root reference
var storageRef = firebase.storage().ref();
var ref = null;
var file = null // use the Blob or File API
// Retrieve the object from storage
var link = localStorage.getItem('link');
var local = (JSON.parse(link));
firebase.database().ref('link/').once('value').then(function(snapshot) {
    json = snapshot.val();
    if (JSON.stringify(json) === JSON.stringify(local)) {
        console.log(true);
    } else {
        console.log(false);
        localStorage.setItem('link', JSON.stringify(json));
        loadUrls(json);
    }
});

function loadUrls(json) {
    length = (Object.keys(json).length);
    links = Object.values(json);
    titles = Object.keys(json);
    html = '';
    for (var i = length - 1; i >= 0; i--) {
        html += '<div class="hola" data-category="' + titles[i] + '"> <h1> ' + titles[i] + ' </h1> ';
        linkData = Object.values(links[i]);
        closeButton = '<div class="thumb-info2"> <i class="fas fa-trash"></i> </div>';
        //infobanner = '<div class="thumb-info" "><span>3234 x 1819</span></div>';
        infobanner = '';
        for (var j = 0; j < 12; j++) {
            if (linkData[j] === undefined) {
                html += '<a href="#" style="background-image: url(thumbnails/www.example.com.png);" onClick="overlayMenu(this)">' + infobanner + '</a>';
            } else {
                html += '<a href="' + linkData[j].url + '" style="background-image: url( ' + linkData[j].background + ');">' + closeButton + '</a>';
            }
        }
        html += '</div>';
    }
    $('#container').empty();
    $('#container').append(html);
    /*if have a # in url click the correct span*/
    if (window.location.hash) {
        $('#pages span:nth-child(' + window.location.hash.substring(1) + ')').click();
    }
}

function uploadFile() {
    var uploadTask = ref.put(file);
    name = $('#name').val();
    url = $('#url').val();
    category = $('#category').val();
    if (name != '' && url != '') {
        uploadTask.on('state_changed', function(snapshot) {}, function(error) {
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            switch (error.code) {
                case 'storage/unauthorized':
                    alert("User doesn't have permission to access the object");
                    break;
                case 'storage/canceled':
                    alert("User canceled the upload");
                    break;
                case 'storage/unknown':
                    alert("Unknown error occurred, inspect error.serverResponse");
                    break;
            }
        }, function() {
            var background = uploadTask.snapshot.downloadURL;
            writeNewUrl(name, url, category, background);
        });
    }
}

function writeNewUrl(name, url, category, background) {
    var response = firebase.database().ref('/link/' + category + '/' + name).set({
        name: name,
        url: url,
        background: background,
    });
    console.log(response);
    response.then(() => {
        alert("Correct Save!!");
        console.log('Se ha guardado con exito')
    })
    response.catch((err) => {
        console.log('Something went wrong check the error ', err)
    })
}
/* 
Menu overlay show
*/
function overlayMenu(object) {
    category = $(object).parent("div").attr('data-category');
    $('.overlay').removeClass('animated fadeOutDown');
    $('.overlay').addClass('animated fadeInUp');
    $('.overlay').show(0);
    $('#category').val(category);
}
/*
    Menu overlay hide
*/
function hideOverlayMenu(object) {
    $('.overlay').removeClass('animated fadeInUp');
    $('.overlay').addClass('animated fadeOutDown');
    $('.overlay').delay(2000).hide(0)
}

$(document).ready(function() {
    if (local != null) loadUrls(local);
    // Detect file element
    $("#fileElem").change(function() {
        // will log a FileList object, view gifs below
        file = (this.files[0]);
        //fileName = (this.files[0].name.split('.')[0]);
        fileName = (this.files[0].name);
        // Create a storage reference from our storage service
        ref = storageRef.child('img/' + fileName);
        readURL(this);
    });

    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
                $('#preview').attr('src', e.target.result);
                $('#preview').fadeIn(500);
                $('#upload').fadeIn(500);
            }
            reader.readAsDataURL(input.files[0]);
        }
    }



    /*
        hover in elemts a urls
    */    
    $("a[href='#']" ).hover(function() {
        //$(this).css(({"background": "none"}));
        $(this).append('<i class="fas fa-plus plus"></i>' );
    });

    /*
        hover in elemts a urls
    */

    $("a[href='#']" ).mouseleave(function() {
        
        //$(this).css(({"background-image": "url(thumbnails/www.example.com.png)"}));
        $(this).find( ".plus" ).remove();
        /*hola.addClass('animated fadeOut').one(animationEnd, function(){
            console.log($(this));
        });*/
    });

});