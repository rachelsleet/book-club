import app from 'firebase/app';
import 'firebase/auth';

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
        app.initializeApp(config);

        this.auth = app.auth();
    }
    // **** Auth API ****
    doCreateUserWithEmailAndPassword = (email, password) =>
      this.auth.createUserWithEmailAndPassword(email, password);

    doSignInWithEmailAndPassword = (email, password) =>
      this.auth.signInWithEmailAndPassword(email, password);

    doSignOut = () => this.auth.signOut();

    doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

    doPasswordUpdate = password => this.auth.currentUser.updatePassword(password);
}

export default Firebase;