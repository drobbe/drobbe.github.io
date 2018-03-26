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

//writeNewUrl("Slack", "https://shareitydeveloptment.slack.com");

function writeNewUrl(name, url, category, background) {
    var response = firebase.database().ref('/link/'+category+'/' + name).set({
        name: name,
        url: url,
        background: background,
    });
    console.log(response);
    response.then(() => {
        alert("todo bien");
        console.log('Se ha guardado con exitos')
    })
    response.catch((err) => {
        console.log('Something went wrong check the error ', err)
    })
}

firebase.database().ref('/link/').once('value').then(function(snapshot) {
    //console.log(snapshot.val());
    // ...
});

$(document).ready(function() {
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
});

function uploadFile() {
    var uploadTask = ref.put(file);
    name = $('#name').val();
    url  = $('#url').val();
    category  = $('#category').val();
    if(name != '' && url != ''){
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