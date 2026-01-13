import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: 'Home - Archaeology Illustrated',
        description: 'High-resolution historical reconstructions and archaeological illustrations.'
      }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: {
        title: 'About - Archaeology Illustrated',
        description: 'Learn about our mission to visualize history with accuracy and artistry.'
      }
    },
    {
      path: '/collections',
      name: 'collections',
      component: () => import('../views/CollectionsView.vue'),
      meta: {
        title: 'Collections - Archaeology Illustrated',
        description: 'Browse and search our extensive library of historical images.'
      }
    },
    {
      path: '/faq',
      name: 'faq',
      component: () => import('../views/FaqView.vue'),
      meta: {
        title: 'FAQ - Archaeology Illustrated',
        description: 'Frequently asked questions about purchasing and licensing images.'
      }
    },
    {
      path: '/speaking',
      name: 'speaking',
      component: () => import('../views/SpeakingView.vue'),
      meta: {
        title: 'Speaking Engagements - Archaeology Illustrated',
        description: 'Book us for speaking engagements at churches, synagogues, or professional events.'
      }
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/ContactView.vue'),
      meta: {
        title: 'Contact - Archaeology Illustrated',
        description: 'Get in touch with us for inquiries and commissions.'
      }
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('../views/CartView.vue'),
      meta: {
        title: 'Shopping Cart - Archaeology Illustrated',
        description: 'Review and purchase your historical image selections.'
      }
    },
    {
      path: '/account',
      name: 'account',
      component: () => import('../views/AccountView.vue'),
      meta: {
        title: 'Account Settings - Archaeology Illustrated',
        description: 'Manage your profile and purchase history.'
      }
    },
    {
      path: '/bookmarks',
      name: 'bookmarks',
      component: () => import('../views/BookmarksView.vue'),
      meta: {
        title: 'My Bookmarks - Archaeology Illustrated',
        description: 'Your saved historical illustrations.'
      }
    },
  ],
})

router.beforeEach((to, from, next) => {
  const title = to.meta.title as string
  const description = to.meta.description as string
  
  if (title) {
    document.title = title
  }
  
  if (description) {
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', description)
    } else {
      const meta = document.createElement('meta')
      meta.name = 'description'
      meta.content = description
      document.head.appendChild(meta)
    }
  }

  next()
})

export default router
