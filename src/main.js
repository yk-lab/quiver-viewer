import Vue from 'vue'
import LiquorTree from 'liquor-tree'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import Vueaxios from 'vue-axios'
import VueMaterial from 'vue-material'
import firebase from 'firebase/app'
import 'firebase/auth'
//import firebaseui from 'firebaseui'
import CxltToastr from 'cxlt-vue2-toastr'
import VueCodeHighlight from 'vue-code-highlight'
import VueLaTeX2JS from 'latex2vue'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
import 'firebaseui/dist/firebaseui.css'
import 'cxlt-vue2-toastr/dist/css/cxlt-vue2-toastr.css'
import 'vue-code-highlight/themes/prism-twilight.css'

Vue.config.productionTip = false
Vue.use(LiquorTree)
Vue.use(VueMaterial)
Vue.use(CxltToastr)
Vue.use(Vueaxios, axios)
Vue.use(VueCodeHighlight)
Vue.use(VueLaTeX2JS)

// Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyAkfDNO3RlQb-8p5uQc_9C6XL2xd2rHHxM",
  authDomain: "quiver-viewer.firebaseapp.com",
  databaseURL: "https://quiver-viewer.firebaseio.com",
  projectId: "quiver-viewer",
  storageBucket: "",
  messagingSenderId: "839420977384"
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
