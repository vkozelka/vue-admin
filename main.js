import Vue from 'vue'
import App from './App'
import router from './router'
import VueTranslate from 'vue-translate-plugin'

import Vuetify from 'vuetify'
import VueResource from 'vue-resource'
import { SweetModal } from 'sweet-modal-vue'
import Editor from '@tinymce/tinymce-vue'

import 'tinymce/tinymce'

// Layouts
import LoginLayout from './components/Layouts/Login'
import AdminLayout from './components/Layouts/Admin'

// Components
import Grid from './components/UI/Grid'
import Tree from './components/UI/Tree'
import GridActions from './components/UI/Grid/Action'
import GridActionsBulk from './components/UI/Grid/ActionBulk'
import Footer from './components/UI/Footer'
import Alert from './components/UI/Alert'
import Dropzone from './components/UI/Dropzone'
import Image from './components/UI/Image'
import Chart from './components/UI/ChartsBar'

// Libraries
import Auth from './components/Lib/Auth'

// Mixins
import Api from './components/Lib/Api'
import Date from './components/Lib/Date'
import Wysiwyg from './components/Lib/Wysiwyg'

// Languages
import LanguageCs from './languages/cs_CZ'
import LanguageDe from './languages/de_DE'
import LanguageEn from './languages/en_GB'

Vue.component('login-layout', LoginLayout)
Vue.component('admin-layout', AdminLayout)
Vue.component('ui-wysiwyg', Editor)
Vue.component('ui-grid', Grid)
Vue.component('ui-tree', Tree)
Vue.component('ui-dropzone', Dropzone)
Vue.component('ui-image', Image)
Vue.component('ui-grid-actions', GridActions)
Vue.component('ui-grid-actions-bulk', GridActionsBulk)
Vue.component('ui-footer', Footer)
Vue.component('ui-alert', Alert)
Vue.component('ui-chart', Chart)

Vue.config.productionTip = false
Vue.use(Vuetify)
Vue.use(VueResource)
Vue.use(VueTranslate)
Vue.mixin(Api)
Vue.mixin(Date)
Vue.mixin(Wysiwyg)
Vue.component('sweet-modal', SweetModal)

Vue.filter('readableSize', (bytes) => {
  const thresh = 1024
  if (Math.abs(bytes) < thresh) {
    return bytes + ' B'
  }

  const units = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  let u = -1
  do {
    bytes /= thresh
    ++u
  } while (Math.abs(bytes) >= thresh && u < units.length - 1)
  return bytes.toFixed(1) + ' ' + units[u]
})

// All ajax requests have token if available
Vue.http.interceptors.push((request, next) => {
  let token = localStorage.getItem('x-auth-admin-token')
  if (token) {
    request.headers.set('X-Auth-Admin-Token', token)
  }
  next()
})
Vue.http.headers.common['X-Requested-With'] = 'XMLHttpRequest'

// Disallow access to page without valid token
router.beforeEach((to, from, next) => {
  if (true == to.meta.requireAuth) {
    Auth.isLogged().then(r => {
      next();
    }).catch(e => {
      next({path: '/'})
    })
    //return false;
  } else {
    next()
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  created () {
    console.log("created")
  },
  mounted () {
    const locale = localStorage.getItem('x-admin-language')
    if (locale) {
      this.$translate.setLang(locale)
    } else {
      this.$translate.setLang('de_DE')
    }
  },
  locales: {
    en_GB: LanguageEn,
    de_DE: LanguageDe,
    cs_CZ: LanguageCs
  },
  router,
  render: h => h(App)
})
