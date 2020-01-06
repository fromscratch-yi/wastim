import firebase from '~/plugins/firebase'

export const state = () => ({
  uid: null,
  user: null
})

export const getters = {
  uid (state) {
    if (state.user && state.user.uid) {
      return state.user.uid
    } else {
      return null
    }
  },

  user (state) {
    return state.user
  },

  isAuthenticated (state) {
    return !!state.user && !!state.user.uid
  }
}

export const actions = {
  async login ({ dispatch, status }, user) {
    const userInfo = {
      name: user.displayName,
      email: user.email,
      icon: user.photoURL,
      uid: user.uid
    }

    await dispatch('setUSER', userInfo)
    await dispatch('saveUID', userInfo.uid)
  },

  async logout ({ commit }) {
    await firebase.auth().signOut()
    commit('setUSER', null)
    commit('saveUID', null)
  },

  saveUID ({ commit }, uid) {
    commit('saveUID', uid)
  },

  setUSER ({ commit }, user) {
    commit('setUSER', user)
  }
}

export const mutations = {
  saveUID (state, uid) {
    state.uid = uid
  },

  setUSER (state, user) {
    state.user = user
  }
}
