import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import axios from 'axios';
import Cookies from 'js-cookie';
import store from '../store';
import Nutzer from '../views/Nutzer.vue';
import User from '../views/User.vue';

const routes = [
  { path: '/', component: Home, meta: { requiresAuth: true } },
  { path: '/login', component: Login },
  { path: '/nutzer', component: Nutzer, meta: { requiresAuth: true } },
  { path: '/user', component: User, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const token = Cookies.get('token'); // Get the token from cookies

  if (to.meta.requiresAuth && token) {
    try {
      const response = await axios.get('https://api.zuendapp-janus-ig.de/validate_login', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.role) {
        // Instead of setting a cookie, dispatch an action to set the user in the Vuex store
        store.dispatch('setUser', {
          token: token,
          role: response.data.role,
          userId: response.data.user_id, // Add the user ID to the user data
        });

        next();
      } else {
        next('/login');
      }
    } catch (error) {
      next('/login');
    }
  } else if (to.meta.requiresAuth && !token) {
    next('/login');
  } else {
    next();
  }
});

export default router;
