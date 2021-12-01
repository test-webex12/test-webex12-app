<template>
  <div class="about">
    <h1>This is a {{ user.displayName }}'s page</h1>
    <div v-if="partner == null">
      <div v-for="(profile, index) in profiles" :key="index">
        <div @click="goChat(profile.id, profile.name, profile.photoURL)">
          {{ profile.name }}
        </div>
      </div>
    </div>
    <div v-else>
      <div class="form">
        <div class="container" v-for="(talk, index) in talkRoom" :key="index">
          <div>
            {{ talk.text }}
          </div>
        </div>
        <input type="text" v-model="chat" />
        <button @click="post">▷</button>
      </div>
    </div>
  </div>
</template>
<script>
import firebase from "firebase"

export default {
  data() {
    return {
      partner: null,
      partnerName: "",
      partnerPhoto: null,
      profiles: [],
      chat: "",
      date: "",
      talkRoom: [],
      now: "",
      exist: false,
      num: 0,
    }
  },
  methods: {
    async goChat(partnerId, partnerName, partnerPhoto) {
      //チャット開始時に相手の情報とトーク履歴を取得
      this.partner = partnerId
      this.partnerName = partnerName
      this.partnerPhoto = partnerPhoto
      await this.getTalk()
    },
    getTime() {
      // 時間取得
      this.now = new Date()
      const year = this.now.getFullYear()
      const month = this.now.getMonth() + 1
      const day = this.now.getDate()
      const hour = this.now.getHours()
      const minute = this.now.getMinutes()
      this.date = year + "/" + month + "/" + day + " " + hour + ":" + minute
    },
    post() {
      this.getTime()
      //自分のuidドキュメントに追加
      firebase
        .firestore()
        .collection("chat")
        .doc(this.user.uid)
        .collection(this.partner)
        .add({
          text: this.chat,
          date: this.date,
          id: this.user.uid,
          time: this.now,
        })
      //相手のuidドキュメントに追加
      firebase
        .firestore()
        .collection("chat")
        .doc(this.partner)
        .collection(this.user.uid)
        .add({
          text: this.chat,
          date: this.date,
          id: this.user.uid,
          time: this.now,
        })
      this.chat = ""
    },
    getTalk() {
      //更新時トーク履歴を取得
      firebase
        .firestore()
        .collection("chat")
        .doc(this.user.uid)
        .collection(this.partner)
        .orderBy("time")
        .onSnapshot((docs) => {
          if (this.exist == true) {
            //最後の１つのみ表示
            docs.forEach((doc) => {
              this.num += 1
              if (this.num == docs.docs.length) {
                this.talkRoom.push(doc.data())
                this.num = 0
              }
            })
          } else {
            //最初のみ全部表示
            docs.forEach((doc) => {
              this.talkRoom.push(doc.data())
              this.exist = true
            })
          }
        })
    },
  },
  computed: {
    user() {
      return this.$auth.currentUser
    },
  },
  async mounted() {
    //ユーザーを取得
    await firebase
      .firestore()
      .collection("user_profiles")
      .get()
      .then((docs) => {
        docs.forEach((doc) => {
          this.profiles.push(doc.data())
          console.log(doc.data())
        })
      })
  },
}
</script>
