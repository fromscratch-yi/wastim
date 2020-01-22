/* eslint-disable no-console */
import firebase from 'firebase'
import { db } from '~/plugins/firebase.js'

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
      icon: user.photoURL + '?type=large',
      uid: user.uid,
      gender: '',
      year: '',
      month: '',
      day: ''
    }
    await db.collection('users').doc(user.uid).get().then((doc) => {
      if (doc.exists) {
        console.log('Sign In.')
        userInfo.gender = doc.data().gender
        userInfo.year = doc.data().year
        userInfo.month = doc.data().month
        userInfo.day = doc.data().day
      } else {
        console.log('Sign Up.')
        db.collection('users').doc(user.uid).set(userInfo)
      }
    }).catch((error) => {
      console.error('Error getting document:', error)
    })
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
