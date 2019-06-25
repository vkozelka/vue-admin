import Vue from 'vue'
import VueResource from 'vue-resource'
import Api from './Api'

Vue.use(VueResource)
Vue.mixin(Api)

var Auth = new Vue({
  name: 'auth',
  methods: {
    isLogged () {
      return new Promise((resolve, reject) => {
        let token = window.localStorage.getItem('x-auth-admin-token')
        if (!token) {
          reject("No token saved")
        }
        this.apiPost('backend/token/validate',{
          token: token
        }).then(r => {
          if (r && r.body && r.body.error) {
            reject(r.body.error)
          } else {
            resolve(r)
          }
        }).catch(e => {
          reject(e)
        })
      })
    }
  }
})

export default Auth
