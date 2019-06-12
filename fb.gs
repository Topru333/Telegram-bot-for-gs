var firebaseConfig = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    secret: ""
};

function getDataBase() {
  var firebaseUrl = firebaseConfig.databaseURL;
  var secret = firebaseConfig.secret;
  var base = FirebaseApp.getDatabaseByUrl(firebaseUrl, secret);
  return base
}
