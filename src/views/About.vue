<template>
  <div class="about">
    <h1>This is an about page</h1>
    <div>{{ user.displayName }}</div>
    <div v-if="partner == null">
      <div v-for="profile in profiles" :key="profile.id">
        <div>{{ profile.name }}</div>
      </div>
    </div>
    <div v-else>
      <div class="form">
        <input type="text" v-model="chat" />
        <button @click="post">▷</button>
      </div>
    </div>
  </div>
</template>
<script>
import firebase from "./../firebase"
export default {
  data() {
    return {
      partner: null,
      profiles: [],
    }
  },
  computed: {
    user() {
      return this.$auth.currentUser
    },
  },
  async mounted() {
    await firebase
      .firestore()
      .collection("user_profiles")
      .get()
      .then((docs) => {
        console.log(docs)
        docs.forEach((doc) => {
          this.profiles.push(doc.data())
        })
      })
  },
}
</script>
