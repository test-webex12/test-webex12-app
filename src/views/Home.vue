<template>
  <div class="home">
    <button @click="login">login</button>
    <button @click="logout">logout</button>
    <div>{{ user.displayName }}</div>
  </div>
</template>

<script>
// @ is an alias to /src
import firebase from "firebase"
export default {
  name: "Home",
  components: {},
  methods: {
    login() {
      const provider = new firebase.auth.GoogleAuthProvider()
      firebase.auth().signInWithPopup(provider)
    },
    logout() {
      firebase.auth().signOut()
    },
  },
  computed: {
    user() {
      return this.$auth.currentUser
    },
  },
}
</script>
