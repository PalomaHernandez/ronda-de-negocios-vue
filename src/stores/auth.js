import router from '@/router'
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { axiosApiInstance, axiosLoginInstance } from '@/api'
//import { clearValidationErrors, handleErrors } from '@/helpers'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    authenticated: useStorage('authenticated', false),
    loggingIn: false,
    loggingOut: false,
    registering: false,
    user: useStorage('user', {}),
    updating: false,
    success: null,
    error: null,
    info: null,
  }),
  actions: {
    clearMessages() {
      this.info = null
      this.success = null
      this.error = null
    },
    showError(message) {
      this.clearMessages()
      this.error = message
    },
    async register(account) {
      //clearValidationErrors()
      if (!this.registering) {
        this.registering = true
        this.clearMessages()
        this.info = 'Registering your new account...'
        return axiosLoginInstance.get('sanctum/csrf-cookie')
          .then(() => {
            return axiosApiInstance.post('register', account).then(() => {
              this.authenticated = false
              this.registering = false
              this.clearMessages()
              this.success = 'Your account has been created successfully!'
              router.push({ name: 'login' })
            }).catch((error) => {
              throw error
            })
          }).catch((error) => {
            throw error
            /*handleErrors(error).then((message) => {
              this.clearMessages()
              this.error = message
            }).catch((routeName) => {
              router.push({ name: routeName })
            })*/
          }).finally(() => {
            this.registering = false
          })
      }
    },
    /*async updateAccount() {
      //clearValidationErrors()
      if (this.user && !this.updating) {
        this.updating = true
        this.clearMessages()
        this.info = 'Updating your account...'
        return axiosApiInstance.patch(`account/update/${this.user.id}`, this.user)
          .then(() => {
            this.clearMessages()
            this.success = 'The account was updated successfully.'
          }).catch((error) => {
            throw error
            /*handleErrors(error).then((message) => {
              this.clearMessages()
              this.error = message
            }).catch((routeName) => {
              router.push({ name: routeName })
            })
          }).finally(() => {
            this.updating = false
          })
      }
    },*/
    async login(credentials) {
      //clearValidationErrors()
      if (!this.loggingIn) {
        this.loggingIn = true
        this.clearMessages()
        this.info = 'Logging in...'
        return axiosLoginInstance.get('sanctum/csrf-cookie')
          .then(() => {
            return axiosApiInstance.post('login', credentials).then(({ data }) => {
              this.clearMessages()
              if (data.res) {
                this.authenticated = true
                this.user = data.user
                console.log
                router.push({ name: 'LandingPage' })
              } else {
                this.error = data.text
              }
            }).catch((error) => {
              throw error
            })
          }).catch((error) => {
            this.clearMessages()
            throw error
            /*handleErrors(error).then((message) => {
              this.error = message
            }).catch((routeName) => {
              router.push({ name: routeName })
            })*/
          }).finally(() => {
            this.loggingIn = false
          })
      }
    },
    /*async logout() {
      //clearValidationErrors()
      if (!this.loggingOut) {
        this.loggingOut = true
        this.clearMessages()
        this.info = 'Logging out...'
        return axiosApiInstance.post('logout')
          .then(() => {
            this.authenticated = false
            this.loggingOut = false
            this.clearMessages()
            router.push({ name: 'login' })
          }).catch((error) => {
            throw error
            /*handleErrors(error).then((message) => {
              this.clearMessages()
              this.error = message
            }).catch((routeName) => {
              router.push({ name: routeName })
            })
          }).finally(() => {
            this.loggingOut = false
          })
      }
    },*/
  },
})
