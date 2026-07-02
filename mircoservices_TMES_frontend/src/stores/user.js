import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('tms_token') || '')
  const userInfo = ref(JSON.parse(localStorage.getItem('tms_user') || 'null'))

  function login(info) {
    token.value = info.token
    userInfo.value = info
    localStorage.setItem('tms_token', info.token)
    localStorage.setItem('tms_user', JSON.stringify(info))
  }

  function logout() {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('tms_token')
    localStorage.removeItem('tms_user')
  }

  return { token, userInfo, login, logout }
})
