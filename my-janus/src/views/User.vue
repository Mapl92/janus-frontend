<template>
    <div>
      <!-- Navbar -->
      <Navbar />
  
      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          <h1 class="text-2xl font-semibold text-gray-900">Meine Daten</h1>
          <form @submit.prevent="updateUser" class="mt-6 space-y-6">
            <div>
              <label for="first_name" class="block text-sm font-medium text-gray-700">Vorname</label>
              <div class="mt-1">
                <input id="first_name" v-model="user.first_name" type="text"  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              </div>
            </div>
            <div>
              <label for="last_name" class="block text-sm font-medium text-gray-700">Nachname</label>
              <div class="mt-1">
                <input id="last_name" v-model="user.last_name" type="text"  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              </div>
            </div>
            <div>
              <label for="dob" class="block text-sm font-medium text-gray-700">Geburtsdatum</label>
              <div class="mt-1">
                <input id="dob" v-model="user.dob" type="date" class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              </div>
            </div>
            <div>
              <label for="street" class="block text-sm font-medium text-gray-700">Straße</label>
              <div class="mt-1">
                <input id="street" v-model="user.street" type="text" class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              </div>
            </div>
            <div>
              <label for="zip" class="block text-sm font-medium text-gray-700">PLZ</label>
              <div class="mt-1">
                <input id="zip" v-model="user.zip" type="text" class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              </div>
            </div>
            <div>
              <label for="city" class="block text-sm font-medium text-gray-700">Stadt</label>
              <div class="mt-1">
                <input id="city" v-model="user.city" type="text" class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              </div>
            </div>
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">E-Mail-Adresse</label>
              <div class="mt-1">
                <input id="email" v-model="user.email" type="email" class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              </div>
            </div>
            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700">Telefonnummer</label>
              <div class="mt-1">
                <input id="phone" v-model="user.phone" type="tel" class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              </div>
            </div>
            <div>
              <label for="data_sharing" class="block text-sm font-medium text-gray-700">Datenweitergabe</label>
              <div class="mt-1">
                <select id="data_sharing" v-model="user.data_sharing" class="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                  <option value="agree">Ich stimme zu, dass meine Daten mit den anderen Mitgliedern der Janus IG geteilt werden</option>
                  <option value="disagree">Ich stimme nicht zu, dass meine Daten mit den anderen Mitgliedern der Janus IG geteilt werden</option>
                </select>
              </div>
            </div>
            <div>
              <button type="submit" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Speichern
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { mapState } from 'vuex';
  import Navbar from '@/components/Navbar.vue';
  
  export default {
    components: {
      Navbar,
    },
    data() {
      return {
        user: {
          first_name: '',
          last_name: '',
          dob: '',
          street: '',
          zip: '',
          city: '',
          email: '',
          phone: '',
          data_sharing: 'disagree',
        },
      };
    },
    computed: {
      ...mapState({
        token: state => state.user.token,
        userId: state => state.user.userId,
      }),
    },
    methods: {
      async fetchUserData() {
        if (!this.token) {
          console.error("User is not authenticated.");
          return;
        }
  
        try {
          const response = await axios.get(`https://api.zuendapp-janus-ig.de/get_address/${this.userId}`, {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          });
  
          this.user = {
            first_name: response.data.First_Name,
            last_name: response.data.Last_Name,
            dob: this.formatDate(response.data.dob),
            street: response.data.Street,
            zip: response.data.Zip,
            city: response.data.City,
            email: response.data['E-Mail'],
            phone: response.data.Phone,
            data_sharing: response.data.is_active ? 'agree' : 'disagree',
          };
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      },
      async updateUser() {
        if (!this.token) {
          console.error("User is not authenticated.");
          return;
        }
  
        try {
          // Update user data
          await axios.put(`https://api.zuendapp-janus-ig.de/edit_own_address/${this.userId}`, {
            First_Name: this.user.first_name,
            Last_Name: this.user.last_name,
            DOB: this.user.dob,
            Street: this.user.street,
            Zip: this.user.zip,
            City: this.user.city,
            'E-Mail': this.user.email,
            Phone: this.user.phone,
          }, {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          });
  
          // Update user active status based on data sharing agreement
          await axios.put(`https://api.zuendapp-janus-ig.de/change_own_active_status/${this.userId}`, null, {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
            params: {
              is_active: this.user.data_sharing === 'agree',
            },
          });
  
          console.log("User data and active status updated successfully");
          // You can show a success message to the user here
        } catch (error) {
          console.error("Error updating user data or active status:", error);
          // You can show an error message to the user here
        }
      },
      formatDate(dateString) {
        if (!dateString) return '';
        const dateParts = dateString.split('.');
        if (dateParts.length !== 3) return '';
        const [day, month, year] = dateParts;
        return `${year}-${month}-${day}`;
      },
    },
    created() {
      this.fetchUserData();
    },
  };
  </script>