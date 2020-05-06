export const getters = {
    isAuthenticated(state) {
        return state.auth.loggedIn
    },

    loggedUser(state) {
        return state.auth.user.data
    }
}
