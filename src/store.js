import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
      people: [],
      isLoading: false,
      error: null
  },
  mutations: {
      initiateRequest(state) {
        state.isLoading = true;
        state.error = null;
      },
      requestSuccess(state, people) {
        state.people = people;
        state.isLoading = false;
      },
      requestFailure(state, error) {
        state.error = error;
        state.isLoading = false;
      }
  },
  actions: {
      fetchPeople(context) {
        const {commit} = context;
        commit("initiateRequest");

        fetch('http://localhost:8000/people')
          .then(response => response.json())
          .then(people => commit('requestSuccess', people))
          .catch(error => commit('requestFailure', error))
      }
  }
})
