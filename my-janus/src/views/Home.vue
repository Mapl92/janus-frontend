<template>
  <!-- Head Section-->
  <Navbar />
  <!-- End Head Section-->

  <div class="px-4 sm:px-6 lg:px-8 mt-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-none">
        <button v-if="role === 'admin'" @click="showCreateAddressModal = true" class="inline-flex items-center justify-center rounded-md border border-transparent px-4 py-2 bg-gray-600 text-base font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none sm:text-sm">
          <i class="fas fa-plus mr-2"></i>
          Adresse hinzufügen
        </button>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-4 relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <i class="fas fa-search text-gray-400"></i>
        </div>
        <input v-model="searchQuery" @input="performSearch" type="text" placeholder="Suche..." class="pl-10 p-2 border rounded block w-full sm:text-sm border-gray-300">
      </div>
    </div>
    <div>
      <div class="align-middle inline-block min-w-full">
        <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vorname</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nachname</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Geburtstag</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Straße</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PLZ</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stadt</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">E-Mail</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefon</th>
                <th scope="col" class="relative px-6 py-3">
                  <span class="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="address in filteredAddresses" :key="address.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm" :class="{'text-green-500': address.is_active, 'text-red-500': !address.is_active}">
                  <i class="fas fa-user"></i>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ address.First_Name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ address.Last_Name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ address.dob }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ address.Street }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ address.Zip }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ address.City }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ address['E-Mail'] }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ address.Phone }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button v-if="role === 'admin'" @click="showEditAddressModal(address)" class="text-gray-600 hover:text-gray-900 mr-2">
                    <i class="fas fa-edit mr-2"></i>
                  </button>
                  <button v-if="role === 'admin'" @click="deleteAddress(address.id)" class="text-red-400 hover:text-red-900">
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <!-- Create Address Modal -->
    <div v-if="showCreateAddressModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="relative top-20 mx-auto p-5 border w-1/3 shadow-lg rounded-md bg-white">
        <div class="flex justify-between items-start">
          <h3 class="inline bg-gradient-to-r from-indigo-200 via-sky-400 to-indigo-200 bg-clip-text font-display text-5xl tracking-tight text-transparent">Adresse hinzufügen</h3>
          <button @click="showCreateAddressModal = false" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" aria-label="close">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="https://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div class="mt-2 px-7 py-3">
          <form @submit.prevent="createAddress">
            <div class="flex items-center mb-2">
              <i class="fas fa-user mr-2"></i>
              <input v-model="newAddress.First_Name" type="text" placeholder="Vorname" class="w-full p-2 border rounded">
            </div>
            <div class="flex items-center mb-2">
              <i class="fas fa-user mr-2"></i>
              <input v-model="newAddress.Last_Name" type="text" placeholder="Nachname" class="w-full p-2 border rounded">
            </div>
            <div class="flex items-center mb-2">
              <i class="fas fa-calendar-alt mr-2"></i>
              <input v-model="newAddress.DOB" type="date" placeholder="Geburtsdatum" class="w-full p-2 border rounded">
            </div>
            <div class="flex items-center mb-2">
              <i class="fas fa-road mr-2"></i>
              <input v-model="newAddress.Street" type="text" placeholder="Straße" class="w-full p-2 border rounded">
            </div>
            <div class="flex items-center mb-2">
              <i class="fas fa-map mr-2"></i>
              <input v-model="newAddress.Zip" type="text" placeholder="PLZ" class="w-full p-2 border rounded">
            </div>
            <div class="flex items-center mb-2">
              <i class="fas fa-city mr-2"></i>
              <input v-model="newAddress.City" type="text" placeholder="Stadt" class="w-full p-2 border rounded">
            </div>
            <div class="flex items-center mb-2">
              <i class="fas fa-envelope mr-2"></i>
              <input v-model="newAddress['E-Mail']" type="email" placeholder="E-Mail" class="w-full p-2 border rounded">
            </div>
            <div class="flex items-center mb-4">
              <i class="fas fa-phone mr-2"></i>
              <input v-model="newAddress.Phone" type="text" placeholder="Telefon" class="w-full p-2 border rounded">
            </div>
            <button type="submit" class="inline-flex items-center justify-center rounded-md border border-transparent px-4 py-2 bg-gray-600 text-base font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none sm:text-sm">
              Erstellen
            </button>
          </form>
        </div>
      </div>
    </div>
    <!-- Edit Address Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="relative top-20 mx-auto p-5 border w-1/3 shadow-lg rounded-md bg-white">
        <div class="flex justify-between items-start">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Edit Address</h3>
          <button @click="showEditModal = false" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" aria-label="close">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="https://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div class="mt-2 px-7 py-3">
          <form @submit.prevent="updateAddress">
            <div class="flex items-center mb-2">
              <i class="fas fa-user mr-2"></i>
              <input v-model="editingAddress.First_Name" type="text" placeholder="Vorname" class="w-full p-2 border rounded">
            </div>
            <div class="flex items-center mb-2">
              <i class="fas fa-user mr-2"></i>
              <input v-model="editingAddress.Last_Name" type="text" placeholder="Nachname" class="w-full p-2 border rounded">
            </div>
            <div class="flex items-center mb-2">
              <i class="fas fa-calendar-alt mr-2"></i>
              <input v-model="editingAddress.DOB" type="date" placeholder="Geburtsdatum" class="w-full p-2 border rounded">
            </div>
            <div class="flex items-center mb-2">
              <i class="fas fa-road mr-2"></i>
              <input v-model="editingAddress.Street" type="text" placeholder="Straße" class="w-full p-2 border rounded">
            </div>
            <div class="flex items-center mb-2">
              <i class="fas fa-map mr-2"></i>
              <input v-model="editingAddress.Zip" type="text" placeholder="PLZ" class="w-full p-2 border rounded">
            </div>
            <div class="flex items-center mb-2">
              <i class="fas fa-city mr-2"></i>
              <input v-model="editingAddress.City" type="text" placeholder="Stadt" class="w-full p-2 border rounded">
            </div>
            <div class="flex items-center mb-2">
              <i class="fas fa-envelope mr-2"></i>
              <input v-model="editingAddress['E-Mail']" type="email" placeholder="E-Mail" class="w-full p-2 border rounded">
            </div>
            <div class="flex items-center mb-4">
              <i class="fas fa-phone mr-2"></i>
              <input v-model="editingAddress.Phone" type="text" placeholder="Telefon" class="w-full p-2 border rounded">
            </div>
            <button type="submit" class="inline-flex items-center justify-center rounded-md border border-transparent px-4 py-2 bg-gray-600 text-base font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none sm:text-sm">
              speichern
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script>
import { ref, onMounted, watch, computed } from 'vue'; // Make sure to include computed
import axios from 'axios';
import Cookies from 'js-cookie';
import Fuse from 'fuse.js';
import { useStore } from 'vuex'; // Import useStore from Vuex
import Navbar from '@/components/Navbar.vue'; // Import the Navbar component

  
  export default {
    components: {
      Navbar
    },
    setup() {
      const store = useStore(); // Use the store
      const searchQuery = ref('');
      const filteredAddresses = ref([]);
      // get role from store
      const role = computed(() => store.state.user.role);

      const addresses = ref([]);
      const showCreateAddressModal = ref(false);
      const showEditModal = ref(false);
      const newAddress = ref({
          First_Name: '',
          Last_Name: '',
          Street: '',
          'DOB': '' ,
          Zip: '',
          City: '',
          'E-Mail': '',
          Phone: ''
      });
      watch(searchQuery, (newQuery, oldQuery) => {
      performSearch();
      });
      const editingAddress = ref({});
    
      const performSearch = () => {
    if (searchQuery.value.trim() === '') {
        // If the search query is empty, reset to show all addresses or handle as needed
        filteredAddresses.value = addresses.value;
        return;
    }

    const options = {
    isCaseSensitive: false,
    includeScore: true,
    shouldSort: true,
    includeMatches: true, // Helpful for debugging
    findAllMatches: false,
    minMatchCharLength: 1,
    location: 0,
    threshold: 0.3, // Lower this for stricter matching
    distance: 100,
    useExtendedSearch: false,
    ignoreLocation: false,
    keys: ["First_Name", "Last_Name", "Street", "City", "Zip", "Phone", "E-Mail"],
};

    const fuse = new Fuse(addresses.value, options);
    const results = fuse.search(searchQuery.value);
    filteredAddresses.value = results.map(result => result.item);
};
      // Fetch addresses on component mount
      const fetchAddresses = async () => {
          try {
              const token = Cookies.get('token');

              const response = await axios.get('https://api.zuendapp-janus-ig.de/addresses', {
                  headers: {
                      Authorization: `Bearer ${token}`,
                  },
              });
              addresses.value = response.data;
              // Initialize filteredAddresses with all addresses
              filteredAddresses.value = response.data; 
          } catch (error) {
              console.error("Failed to fetch addresses:", error);
          }
      };
  
      const createAddress = async () => {
          try {
              const token = Cookies.get('token');
              await axios.post('https://api.zuendapp-janus-ig.de/create_address', newAddress.value, {
                  headers: {
                      Authorization: `Bearer ${token}`,
                      'Content-Type': 'application/json'
                  },
              });
              showCreateAddressModal.value = false;
              newAddress.value = {
                  First_Name: '',
                  Last_Name: '',
                  Street: '',
                  Zip: '',
                  City: '',
                  'E-Mail': '',
                  Phone: ''
              };
              fetchAddresses();
          } catch (error) {
              console.error("Failed to create address:", error);
          }
      };
  
      const showEditAddressModal = (address) => {
          editingAddress.value = {...address};
          showEditModal.value = true;
      };
  
      const updateAddress = async () => {
          try {
              const token = Cookies.get('token');
              await axios.put(`https://api.zuendapp-janus-ig.de/edit_address/${editingAddress.value.id}`, editingAddress.value, {
                  headers: {
                      Authorization: `Bearer ${token}`,
                      'Content-Type': 'application/json'
                  },
              });
              showEditModal.value = false;
              fetchAddresses();
          } catch (error) {
              console.error("Failed to update address:", error);
          }
      };
  
      const deleteAddress = async (id) => {
          try {
              const token = Cookies.get('token');
              await axios.delete(`https://api.zuendapp-janus-ig.de/delete_address/${id}`, {
                  headers: {
                      Authorization: `Bearer ${token}`,
                  },
              });
              fetchAddresses();
          } catch (error) {
              console.error(`Failed to delete address with id ${id}:`, error);
          }
      };
  
      onMounted(fetchAddresses);
  
      return {
        searchQuery,
        performSearch,
        filteredAddresses,
        role,
        addresses,
        showCreateAddressModal,
        showEditModal,
        newAddress,
        editingAddress,
        createAddress,
        showEditAddressModal,
        updateAddress,
        deleteAddress
      };
    },
  };
  </script>
  
  <style>
  /* Add your custom styles here if needed */
  </style>
  

  


