import Vue from 'vue'
import Vuex from 'vuex'

import user from './module/user';
import goods from './module/goods';
import order from './module/order';

Vue.use(Vuex)

export default new Vuex.Store({
  modules:{
    user,
    goods,
    order
  }
})