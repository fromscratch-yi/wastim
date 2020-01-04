import { getUserFromCookie } from '@/helpers'

export const actions = {
  async nuxtServerInit ({ dispatch }, { req }) {
    const user = getUserFromCookie(req)
    // eslint-disable-next-line no-console
    console.log(user)
    if (user) {
      await dispatch('modules/user/setUSER', {
        name: user.name,
        email: user.email,
        icon: user.picture,
        uid: user.user_id
      })
    }
  }
}
