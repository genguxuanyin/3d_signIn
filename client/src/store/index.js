import Vue from 'vue'
import Vuex from 'vuex'

import user from './module/user';
import signInUser from './module/signInUser';
import goods from './module/goods';
import order from './module/order';

Vue.use(Vuex)

export default new Vuex.Store({
  modules:{
    user,
    signInUser,
    goods,
    order
  }
})