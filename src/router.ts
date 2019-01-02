import Vue from 'vue';
import Router from 'vue-router';
import Petitions from './views/Petitions.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'petitions',
      component: Petitions,
    },
    {
      path: '/petitions/new',
      name: 'newPetition',
      component: () => import(/* webpackChunkName: "newPetition" */ './views/NewPetition.vue'),
    },
  ],
});
