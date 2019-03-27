const types = {
    SET_IS_SIGNIN_AUTNENTIATED: 'SET_IS_SIGNIN_AUTNENTIATED', // 是否认证通过
    SET_SIGNIN_USER: 'SET_SIGNIN_USER'
}

const state = { // 需要维护的状态
    isSignInAutnenticated: false, // 是否认证
    signInUser: {}, // 存储当前用户信息
}

const getters = {
    isSignInAutnenticated: state => state.isSignInAutnenticated,
    signInUser: state => state.signInUser
}

const mutations = {
    [types.SET_IS_SIGNIN_AUTNENTIATED](state, isSignInAutnenticated) {
        if (isSignInAutnenticated)
            state.isSignInAutnenticated = isSignInAutnenticated
        else
            state.isSignInAutnenticated = false
    },
    [types.SET_SIGNIN_USER](state, signInUser) {
        if (signInUser)
            state.signInUser = signInUser
        else
            state.signInUser = {}
    }
}

const actions = {
    setIsSignInAutnenticated: ({
        commit
    }, isSignInAutnenticated) => {
        commit(types.SET_IS_SIGNIN_AUTNENTIATED, isSignInAutnenticated)
    },
    setSignInUser: ({
        commit
    }, signInUser) => {
        commit(types.SET_SIGNIN_USER, signInUser)
    },
    clearCurrentSignInState: ({
        commit
    }) => {
        commit(types.SET_IS_SIGNIN_AUTNENTIATED, false)
        commit(types.SET_SIGNIN_USER, null)
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}