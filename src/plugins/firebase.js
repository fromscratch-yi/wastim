import firebase from 'firebase/app'
import 'firebase/auth'

const config = {
  apiKey: process.env.FB_API_KEY,
  authDomain: `${process.env.FB_PROJECT_ID}.firebaseapp.com`,
  databaseURL: `https://${process.env.FB_PROJECT_ID}.firebaseio.com`,
  projectId: process.env.FB_API_KEY,
  storageBucket: `${process.env.FB_API_KEY}.appspot.com`,
  messagingSenderId: process.env.FB_MESSAGE_SENDER_ID

}

const googleProvider = new firebase.auth.GoogleAuthProvider()
const facebookProvider = new firebase.auth.FacebookAuthProvider()

export default !firebase.apps.length ? firebase.initializeApp(config) : firebase.app()

export { googleProvider, facebookProvider }
