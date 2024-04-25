<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="max-w-md w-full space-y-8">
        <form class="mt-8 space-y-6" @submit.prevent="login">
          <input type="hidden" name="remember" value="true">
          <div class="rounded-md shadow-sm -space-y-px">
            <div>
              <label for="username" class="sr-only">Nutzername</label>
              <input id="username" name="username" type="text" v-model="username" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Nutzername">
            </div>
            <div>
              <label for="password" class="sr-only">Passwort</label>
              <input id="password" name="password" type="password" v-model="password" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Passwort">
            </div>
          </div>
  
          <div>
            <button type="submit" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
              Einloggen
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router'; // Import useRouter
import axios from 'axios';
import Cookies from 'js-cookie';

export default {
  setup() {
    const username = ref('');
    const password = ref('');
    const router = useRouter(); // Use useRouter here

    const login = async () => {
      try {
        const response = await axios.post('https://api.zuendapp-janus-ig.de/login', {
          username: username.value,
          password: password.value,
        });
        Cookies.set('token', response.data.access_token, { secure: true, sameSite: 'Lax' }); // Save the token as a cookie
        // Redirect to the homepage
        router.replace('/');  // Use router.replace instead of this.$router
      } catch (error) {
        console.error('Authentication failed:', error);
        // Handle error, e.g., show an error message
      }
    };

    return {
      username,
      password,
      login
    };
  }
};
</script>
