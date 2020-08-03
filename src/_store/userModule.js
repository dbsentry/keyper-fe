import { userService } from '../_helpers';
import Vue from "vue";

export const userStore = {
    namespaced: true,
    state: {
        all: []
    },
    getters: {
        getUserById: (state) => (id) => {
            Vue.$log.debug("In getUserbyID: " + id);
            return state.all.find(user => user.cn === id);
        }
    },
    actions: {
        getUsers({ dispatch, commit }) {
            commit('getUsers');

            userService.getUsers()
                .then(
                    users => commit('getUsersSuccess', users),
                    error => {
                        commit('getUsersFailure', error)
                        dispatch('alert/danger', "Error getting User List", { root: true });
                    }
                );
        },
        updateUser({ dispatch, commit }, { user }) {
            Vue.$log.debug("In updateUser: " + JSON.stringify(user));
            userService.updateUser(user)
                .then(
                    upd_user => {
                        commit('updateUserSuccess', upd_user);
                        dispatch('alert/success', "User Saved", { root: true });
                    },
                    error => {
                        commit('updateUserFailure', error)
                        dispatch('alert/danger', "Update User Error", { root: true });
                    }
                );
        },
        deleteUser({ dispatch, commit }, { userDel }) {
            Vue.$log.debug("In deleteUser: " + JSON.stringify(userDel));
            userService.deleteUser(userDel.cn)
                .then(
                    user => {
                        commit('deleteUserSuccess', user);
                        dispatch('alert/success', "User(s) Deleted", { root: true });
                    },
                    error => {
                        commit('deleteUserFailure', error)
                        dispatch('alert/danger', "Delete User Error", { root: true });
                    }

                );
        },
        addUser({ dispatch, commit }, { user }) {
            Vue.$log.debug("Enter");
            Vue.$log.debug("user: " + JSON.stringify(user));
            userService.createUser(user)
                .then(
                    add_user => {
                        commit('createUserSuccess', add_user)
                        dispatch('alert/success', "User Added", { root: true });
                    },
                    error => {
                        commit('createUserFailure', error);
                        dispatch('alert/danger', "Add User Error", { root: true });
                    }

                );
        },
        resetState({ commit }) {
            commit('resetUsers');
        },
    },

    mutations: {
        getUsers(state) {
            Vue.$log.debug("getUsers Enter")
            state.all = [];
        },
        getUsersSuccess(state, users) {
            Vue.$log.debug("getUsersSuccess Enter")
            state.all =  users ;
        },
        getUsersFailure(state, error) {
            Vue.$log.debug("getUsersFailure Enter")

            state.all = { error };
        },
        updateUserSuccess(state, user) {
            Vue.$log.debug("updateUsersSuccess Enter");
            Vue.$log.debug("user: " + JSON.stringify(user));
            const index = state.all.findIndex((stateUser) => stateUser.cn === user.cn);
            state.all[index] = user.changes;
        },
        updateUserFailure(state, error) {
            Vue.$log.error("updateUsersFailure Enter")
        },
        deleteUserSuccess(state, user) {
            Vue.$log.debug("deleteUsersSuccess Enter");
            Vue.$log.debug("user: " + user);
            var userDelCn = user.split(":")[1].trim();
            Vue.$log.debug("userDelCn: " + userDelCn);

            const index = state.all.findIndex((stateUser) => stateUser.cn === userDelCn);
            Vue.$log.debug("index: " + index);

            if (index > -1 ) {
                state.all.splice(index,1);
            } 
        },
        deleteUserFailure(state, error) {
            Vue.$log.error("updateUsersFailure Enter")
        },
        createUserSuccess(state, user) {
            Vue.$log.debug("Enter");
            Vue.$log.debug("user: " + JSON.stringify(user));
            state.all.push(user);
        },
        createUserFailure(state, error) {
            Vue.$log.error("Enter")
        },
        resetUsers(state) {
            Vue.$log.debug("Enter")
            state.all = [];
        },
    }
}