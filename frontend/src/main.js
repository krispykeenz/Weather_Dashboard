import { createApp } from 'vue'
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import App from './App.vue'
import Dashboard from './views/Dashboard.vue'
import Analytics from './views/Analytics.vue'
import Maps from './views/Maps.vue'
import './style.css'

const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true'

const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/dashboard', component: Dashboard },
  { path: '/analytics', component: Analytics },
  { path: '/maps', component: Maps }
]

const router = createRouter({
  // GitHub Pages is static hosting; hash routing prevents 404s on deep links.
  history: isDemoMode ? createWebHashHistory() : createWebHistory(),
  routes
})

createApp(App).use(router).mount('#app')
