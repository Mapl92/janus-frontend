<template>
    <!-- Head Section-->
    <Navbar />
    <!-- End Head Section-->

    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <!-- Removed margin-top from the div below -->
        <div>
            <div class="align-middle inline-block min-w-full">
                <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nutzername</th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rolle</th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aktiv</th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aktionen</th>
                                <th scope="col" class="relative px-6 py-3">
                                    <span class="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-for="user in users" :key="user.id">
                                <!-- Bind individual address properties to table cells -->
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <i class="fas fa-user"></i> <!-- Font Awesome person icon -->
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ user.username }}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ user.role }}</td>
                                <td>
                                    <label class="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" :checked="user.is_active" class="sr-only peer" @change="toggleActiveStatus(user.id, user.is_active)">
                                        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                        <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300"></span>
                                    </label>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <button @click="changePassword(user.id)" class="text-indigo-600 hover:text-indigo-900">
                                        Passwort ändern
                                    </button>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <!-- Conditional rendering based on admin role for edit and delete -->
                                    <button v-if="role === 'admin'" @click="showEditAddressModal(address)" class="text-gray-600 hover:text-gray-900 mr-2">
                                        <i class="fas fa-edit mr-2"></i> <!-- Font Awesome edit icon -->
                                    </button>
                                    <button v-if="role === 'admin'" @click="deleteAddress(address.id)" class="text-red-400 hover:text-red-900">
                                        <i class="fas fa-trash"></i> <!-- Font Awesome trash icon -->
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Navbar from '@/components/Navbar.vue';
import { mapState } from 'vuex';

export default {
    components: {
        Navbar, // Make sure the Navbar component is correctly imported and used
    },
    data() {
        return {
            users: [], // To hold the users once they are fetched
        };
    },
    computed: {
        // Map the user object from Vuex state
        ...mapState({
            user: state => state.user,
        }),
    },
    methods: {
        async fetchUsers() {
            if (!this.user.token) {
                console.error("User is not authenticated.");
                return;
            }
            
            try {
                const response = await axios.get('https://api.zuendapp-janus-ig.de/users', {
                    headers: {
                        Authorization: `Bearer ${this.user.token}`,
                    },
                });
                this.users = response.data; // Assuming the data is the array of users
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        },

        /**
         * Toggle the active status of a user.
         * 
         * @param {number} id - The ID of the user.
         * @param {boolean} currentStatus - The current active status of the user.
         */
        async toggleActiveStatus(id, currentStatus) {
            if (!this.user.token) {
                console.error("User is not authenticated.");
                return;
            }

            try {
                const response = await axios.put(`https://api.zuendapp-janus-ig.de/change_active_status/${id}`, {}, {
                    headers: {
                        Authorization: `Bearer ${this.user.token}`,
                    },
                });

                // Update the user's status in the local state
                const userIndex = this.users.findIndex(u => u.id === id);
                if (userIndex !== -1) {
                    this.users[userIndex].is_active = !currentStatus;
                }

                console.log("Active status updated:", response.data);
            } catch (error) {
                console.error("Error updating active status:", error);
            }
        },

        async changePassword(userId) {
            if (!this.user.token) {
                console.error("User is not authenticated.");
                return;
            }

            // Prompt the admin user to enter the new password
            const newPassword = prompt("Enter the new password for the user:");

            if (newPassword) {
                try {
                    const response = await axios.post(`https://api.zuendapp-janus-ig.de/change_password/${userId}`, {
                        new_password: newPassword
                    }, {
                        headers: {
                            Authorization: `Bearer ${this.user.token}`,
                        },
                    });

                    console.log("Password changed successfully:", response.data);
                    // You can show a success message to the admin user here
                } catch (error) {
                    console.error("Error changing password:", error);
                    // You can show an error message to the admin user here
                }
            }
        },
    },
    created() {
        this.fetchUsers(); // Fetch users when the component is created
    }
}
</script>



