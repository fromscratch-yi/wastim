<template lang="pug">
  section.container
    div(v-if="user")
      p User ID: {{ uid }}
      p Current User: {{ user.name }}
      img(v-if="user.icon" :src="user.icon" alt="")
      p All DB User {{ allusers }}
</template>

<script>
import { mapGetters } from 'vuex'
import firebase from '@/plugins/firebase'
export default {
  layout: 'mypage',
  data () {
    return {
      allusers: []
    }
  },
  computed: {
    ...mapGetters('modules/user', [
      'uid',
      'user'
    ])
  },
  mounted () {
    this.$nextTick(() => {
      this.readAllUserFromDB()
    })
  },
  methods: {
    readAllUserFromDB () {
      const userRef = firebase.database().ref('/users')
      userRef.once('value', (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          this.allusers.push(childSnapshot.val())
        })
      })
    }
  }
}
</script>
