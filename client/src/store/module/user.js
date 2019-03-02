const types = {
    SET_IS_AUTNENTIATED: 'SET_IS_AUTNENTIATED', // 是否认证通过
    SET_USER: 'SET_USER', // 当前用户信息
    SET_USERS: 'SET_USERS' // 所有用户信息
}

const state = { // 需要维护的状态
    isAutnenticated: false, // 是否认证
    user: {}, // 存储当前用户信息
    users: [] // 存储所有用户信息
}

const getters = {
    isAutnenticated: state => state.isAutnenticated,
    user: state => state.user,
    users: state => state.users
}

const mutations = {
    [types.SET_IS_AUTNENTIATED](state, isAutnenticated) {
        if (isAutnenticated)
            state.isAutnenticated = isAutnenticated
        else
            state.isAutnenticated = false
    },
    [types.SET_USER](state, user) {
        if (user)
            state.user = user
        else
            state.user = {}
    },
    [types.SET_USERS](state, users) {
        if (users)
            state.users = users
        else
            state.users = []
    }
}

const actions = {
    setIsAutnenticated: ({
        commit
    }, isAutnenticated) => {
        commit(types.SET_IS_AUTNENTIATED, isAutnenticated)
    },
    setUser: ({
        commit
    }, user) => {
        commit(types.SET_USER, user)
    },
    setUsers: ({
        commit
    }, users) => {
        commit(types.SET_USERS, users)
    },
    clearCurrentState: ({
        commit
    }) => {
        commit(types.SET_IS_AUTNENTIATED, false)
        commit(types.SET_USER, null)
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}