import app from 'firebase/app';

var config = {
    apiKey: "AIzaSyBYHwEc2AklnqwWbHnHGzfApuVThisNP7E",
    authDomain: "book-club-ac660.firebaseapp.com",
    databaseURL: "https://book-club-ac660.firebaseio.com",
    projectId: "book-club-ac660",
    storageBucket: "book-club-ac660.appspot.com",
    messagingSenderId: "706653381691"
  };

class Firebase {
    constructor() {
        app.initializeApp(config)
    }
}

export default Firebase;