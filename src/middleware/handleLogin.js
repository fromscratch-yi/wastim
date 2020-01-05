import firebase from '@/plugins/firebase'
export default function ({ store, redirect }) {
  firebase.auth().onAuthStateChanged((user) => {
    // eslint-disable-next-line no-console
    console.log('handleLoginMiddle onAuthStateChanged', user)
    if (user) {
      store.dispatch('modules/user/login', user)
    }
  })
  if (store.getters['modules/user/isAuthenticated']) {
    return redirect('/mypage')
  }
}
