<template>
  <nav class="bg-gray-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <img class="h-10 w-10" src="@/assets/logo.png" alt="Your Logo">
          </div>
          <div class="hidden md:block">
            <div class="ml-10 flex items-baseline space-x-4">
              <router-link to="/" class="px-3 py-2 rounded-md text-sm font-medium text-white bg-gray-900 focus:outline-none focus:text-white focus:bg-gray-700" :class="{ 'active': isCurrentRoute('/') }">Dokumente</router-link>
              <router-link v-if="isAdmin" to="/nutzer" class="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700" :class="{ 'active': isCurrentRoute('/nutzer') }">Nutzerverwaltung</router-link>
            </div>
          </div>
        </div>
        <div class="hidden md:block">
          <div class="ml-4 flex items-center md:ml-6">
            <button @click="logout" class="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700">Ausloggen</button>
          </div>
        </div>
        <div class="-mr-2 flex md:hidden">
          <!-- Mobile menu button -->
          <button @click="toggleMenu" class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:text-white">
            <!-- Menu open: "hidden", Menu closed: "block" -->
            <svg :class="{ 'hidden': isOpen, 'block': !isOpen }" class="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <!-- Menu open: "block", Menu closed: "hidden" -->
            <svg :class="{ 'block': isOpen, 'hidden': !isOpen }" class="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
    <!-- Mobile menu, toggle classes based on menu state -->
    <div :class="{ 'block': isOpen, 'hidden': !isOpen }" class="md:hidden">
      <div class="px-2 pt-2 pb-3 sm:px-3">
        <router-link to="/" class="block px-3 py-2 rounded-md text-base font-medium text-white bg-gray-900 focus:outline-none focus:text-white focus:bg-gray-700" :class="{ 'active': isCurrentRoute('/') }">Mitglieder</router-link>
        <router-link v-if="isAdmin" to="/nutzer" class="mt-1 block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700" :class="{ 'active': isCurrentRoute('/nutzer') }">Nutzerverwaltung</router-link>
      </div>
      <div class="pt-4 pb-3 border-t border-gray-700">
        <div class="flex items-center px-5">
          <button @click="logout" class="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700">Ausloggen</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      isOpen: false
    };
  },
  computed: {
    isAdmin() {
      return this.$store.state.user.role === 'admin';
    },
    isUser() {
      return this.$store.state.user.role === 'user';
    },
  },
  methods: {
    logout() {
      this.$store.dispatch('logoutUser');
      this.$router.push('/login');
    },
    isCurrentRoute(route) {
      return this.$route.path === route;
    },
    toggleMenu() {
      this.isOpen = !this.isOpen;
    }
  },
};
</script>

<style scoped>
.router-link-active {
  @apply bg-gray-900 text-white;
}
.router-link-exact-active {
  @apply bg-gray-900 text-white;
}
</style>