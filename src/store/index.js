import { createStore } from "vuex";

export default createStore({
  state: {
    token: "",
    profile: {},
    auths: {},
  },
  mutations: {
    setToken(state, data) {
      state.token = data;
      localStorage.setItem("token", data);
    },
    setProfile(state, data) {
      state.profile = data;
      localStorage.setItem("profile", data);
    },
    setAuths(state, data) {
      state.auths = data;
      localStorage.setItem("auths", data);
    },
  },
  actions: {},
  getters: {
    getToken(state) {
      state.token = localStorage.getItem("token");
      return state.token;
    },
    getProfile(state) {
      if (localStorage.getItem("profile") != "") {
        state.profile = JSON.parse(localStorage.getItem("profile"));
      }

      return state.profile;
    },
    getAuths(state) {
      state.auths = JSON.parse(localStorage.getItem("auths"));
      return state.auths;
    },
  },
});
