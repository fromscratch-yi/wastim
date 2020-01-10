<template lang="pug">
  Loading(v-if="loading")
  .contents(v-else)
    my-header
    nuxt
    my-nav
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Loading from '@/components/Loading'
import MyHeader from '@/components/MyHeader'
import MyNav from '@/components/MyNav'
import firebase from '@/plugins/firebase'

export default {
  components: {
    Loading,
    MyHeader,
    MyNav
  },
  data () {
    return {
      loading: true
    }
  },
  computed: {
    ...mapGetters('modules/user', [
      'isAuthenticated'
    ])
  },
  beforeCreate () {
    if (!this.isAuthenticated) {
      this.loading = true
      // ここでローディングのインジケータアニメーションを表示すると良い
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.login(user)
          this.loading = false
        } else {
          this.$router.push(this.localePath('index'))
        }
      })
    }
  },
  methods: {
    ...mapActions('modules/user', [
      'login'
    ])
  }
}
</script>

<style lang="scss" scoped>
  .contents {
    background: #ffffff;
    flex: 1;
    padding-bottom: 85px;
  }
</style>
