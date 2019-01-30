import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueCookie from 'vue-cookie'

// font awesome settings

import { library } from '@fortawesome/fontawesome-svg-core'
import { faSkullCrossbones, faPlus, faSkull, faFlag, faUser, faHeart, faUserTimes, faRedoAlt, faFistRaised, faStop, faCaretRight, faSyncAlt, faUserMinus, faUserPlus} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faPlus, faSkull, faFlag, faUser, faSkullCrossbones, faHeart, faUserTimes, faRedoAlt, faFistRaised, faStop, faCaretRight, faSyncAlt, faUserMinus, faUserPlus)

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.use(VueCookie);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
