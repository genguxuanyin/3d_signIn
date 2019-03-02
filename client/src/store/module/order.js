const types = {
    SET_ORDERS: 'SET_ORDERS' // 用户信息
}

const state = { // 需要维护的状态
    order: {} // 存储用户信息
}

const getters = {
    order: state => state.order
}

const mutations = {
    [types.SET_ORDERS](state, order) {
        if (order)
            state.order = order
        else
            state.order = {}
    }
}

const actions = {
    setOrders: ({
        commit
    }, order) => {
        commit(types.SET_ORDERS, order)
    },
    clearOrders: ({
        commit
    }) => {
        commit(types.SET_ORDERS, null)
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}