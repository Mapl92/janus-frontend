import { createApp } from 'vue'
import App from './App.vue'
import router from './router'  // make sure this is imported
import store from './store'
import 'flowbite';
// ... Any other imports you might have ...

const app = createApp(App)

app.use(router) // make sure the router is used here
app.use(store)
app.mount('#app')
