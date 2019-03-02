const types = {
    SET_GOODS: 'SET_GOODS' // 用户信息
}

const state = { // 需要维护的状态
    goods: {} // 存储用户信息
}

const getters = {
    goods: state => state.goods
}

const mutations = {
    [types.SET_GOODS](state, goods) {
        if (goods)
            state.goods = goods
        else
            state.goods = {}
    }
}

const actions = {
    setGoods: ({
        commit
    }, goods) => {
        commit(types.SET_GOODS, goods)
    },
    clearGoods: ({
        commit
    }) => {
        commit(types.SET_GOODS, null)
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}