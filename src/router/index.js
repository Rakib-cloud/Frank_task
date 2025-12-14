import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Layouts
import MainLayout from '@/layouts/MainLayout.vue'

// Views
import LoginView from '@/views/LoginView.vue'
import DashboardView from '@/views/DashboardView.vue'
import ProductsView from '@/views/ProductsView.vue'
import ReviewsView from '@/views/ReviewsView.vue'
import TeamView from '@/views/TeamView.vue'
import CampaignsView from '@/views/CampaignsView.vue'
import RewardsView from '@/views/RewardsView.vue'
import CompetitorsView from '@/views/CompetitorsView.vue'
import BillingView from '@/views/BillingView.vue'
import NetworkView from '@/views/NetworkView.vue'
import SettingsView from '@/views/SettingsView.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: DashboardView
      },
      {
        path: 'products',
        name: 'Products',
        component: ProductsView
      },
      {
        path: 'reviews',
        name: 'Reviews',
        component: ReviewsView
      },
      {
        path: 'team',
        name: 'Team',
        component: TeamView
      },
      {
        path: 'campaigns',
        name: 'Campaigns',
        component: CampaignsView
      },
      {
        path: 'rewards',
        name: 'Rewards',
        component: RewardsView
      },
      {
        path: 'competitors',
        name: 'Competitors',
        component: CompetitorsView
      },
      {
        path: 'billing',
        name: 'Billing',
        component: BillingView
      },
      {
        path: 'network',
        name: 'Network',
        component: NetworkView
      },
      {
        path: 'settings',
        name: 'Settings',
        component: SettingsView
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
