import Vue from "vue"
import firebase from "firebase"
import "firebase/firestore"
import "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyBmc4iyu_aOZMGtI09K193Eo37lh5mYl40",
  authDomain: "test-webex-be894.firebaseapp.com",
  projectId: "test-webex-be894",
  storageBucket: "test-webex-be894.appspot.com",
  messagingSenderId: "825987465500",
  appId: "1:825987465500:web:db2b38a594224c4b0a3ad9",
  measurementId: "G-8P0L8LQJ9K",
}

firebase.initializeApp(firebaseConfig)

/**
 * Vue.observable を使って、firebase.auth()をVueアプリ全体に共有する。
 * this.$authがアプリ全体でアクセスできる様になる。
 * @example
 * firebase.auth().currentUser.displayにアクセスする例。任意のコンポーネントで以下の様に記述できる。
 * ```js
 * this.$auth.currentUser.displayName // "displayName" or ""
 * ```
 */

const initialUserState = {
  uid: "",
  displayName: "",
  photoURL: "",
}
const $auth = Vue.observable({
  currentUser: { ...initialUserState },
})
firebase.auth().onAuthStateChanged((user) => {
  let state
  if (user) {
    const { uid, displayName, photoURL } = user
    state = {
      uid,
      displayName,
      photoURL,
    }
  } else {
    state = initialUserState
  }
  Object.assign($auth.currentUser, state)
})
Vue.prototype.$auth = $auth
