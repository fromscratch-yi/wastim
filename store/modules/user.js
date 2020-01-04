/* eslint-disable no-console */
import Cookies from 'js-cookie'
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
    console.log('[STORE ACTIONS] - login')
    const token = await firebase.auth().currentUser.getIdToken(true)
    const userInfo = {
      name: user.displayName,
      email: user.email,
      icon: user.photoURL,
      uid: user.uid
    }

    Cookies.set('access_token', token)
    await dispatch('setUSER', userInfo)
    await dispatch('saveUID', userInfo.uid)
    console.log('[STORE ACTIONS] - in login, response:', status)
  },

  async logout ({ commit }) {
    console.log('[STORE ACTIONS] - logout')
    await firebase.auth().signOut()

    Cookies.remove('access_token')
    commit('setUSER', null)
    commit('saveUID', null)
  },

  saveUID ({ commit }, uid) {
    console.log('[STORE ACTIONS] - saveUID')
    commit('saveUID', uid)
  },

  setUSER ({ commit }, user) {
    console.log('[STORE ACTIONS] - setUSER')
    commit('setUSER', user)
  }
}

export const mutations = {
  saveUID (state, uid) {
    console.log('[STORE MUTATIONS] - saveUID:', uid)
    state.uid = uid
  },

  setUSER (state, user) {
    console.log('[STORE MUTATIONS] - setUSER:', user)
    state.user = user
  }
}
