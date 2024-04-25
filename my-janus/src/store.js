// store/index.js

import { createStore } from 'vuex';

export default createStore({
  state: {
    user: {
      token: null,
      role: null,
      userId: null, // Add userId to the user state
      firstTime: null,
    },
  },
  mutations: {
    SET_USER(state, userData) {
      state.user.token = userData.token;
      state.user.role = userData.role;
      state.user.userId = userData.userId; // Set the userId in the user state
      state.user.firstTime = userData.firstTime;
    },
    LOGOUT_USER(state) {
      state.user.token = null;
      state.user.role = null;
      state.user.userId = null; // Clear the userId on logout
      state.user.firstTime = null;
    },
  },
  actions: {
    setUser({ commit }, userData) {
      commit('SET_USER', userData);
    },
    logoutUser({ commit }) {
      commit('LOGOUT_USER');
    },
  },
});