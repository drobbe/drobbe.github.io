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
var file = null // use the Blob or File API
var ref = null;
writeUserData(2, "pedro2", "edgar2d@hoami.com", "cu2lo.png");

function writeUserData(userId, name, email, imageUrl) {
    firebase.database().ref('users/' + userId).set({
        username: name,
        email: email,
        profile_picture: imageUrl
    });
}
firebase.database().ref('/users/').once('value').then(function(snapshot) {
    console.log(snapshot.val());
    // ...
});
$(document).ready(function() {
    // Detect file element
    $("#fileElem").change(function() {
        // will log a FileList object, view gifs below
        file = (this.files[0]);
        fileName = (this.files[0].name);
        //name file without extension
        //fileName = (this.files[0].name.split('.')[0]);
        // Create a storage reference from our storage service
        ref = storageRef.child('img/' + fileName);
        readURL(this);
    });

    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            if( $('#url').val() != '' && $('#name').val() != '')
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
        var downloadURL = uploadTask.snapshot.downloadURL;
        console.log(downloadURL);
    });
}