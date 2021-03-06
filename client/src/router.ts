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
      path: '/petitions/:address',
      name: 'petition',
      component: () => import(/* webpackChunkName: "wallet" */ './views/ShowPetition.vue'),
    },
    {
      path: '/connect',
      name: 'connect',
      component: () => import(/* webpackChunkName: "connect" */ './views/Connect.vue'),
    },
    {
      path: '/wallet',
      name: 'wallet',
      component: () => import(/* webpackChunkName: "wallet" */ './views/Wallet.vue'),
    },
  ],
});
