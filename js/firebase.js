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
console.log(username);