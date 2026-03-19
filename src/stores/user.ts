import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { ImageItem, ImagePrice } from './images'

export interface CartItem {
  image: ImageItem
  price: ImagePrice
}

export interface SavedCard {
    id: string
    last4: string
    brand: string // 'visa', 'mastercard', etc.
}

export interface UserAccount {
  name: string
  email: string
  address: string
  city: string
  country: string
  zip: string
  cardNumber: string // Keeping for legacy/display of "default" card
  savedCards: SavedCard[]
  isSubscribed: boolean
  purchaseHistory: { date: Date, title: string, price: number }[]
}

interface LoginPayload {
  email: string
  name?: string
}

const USER_EMAIL_STORAGE_KEY = 'arcill-user-email'

const defaultAccountState: UserAccount = {
  name: 'Guest',
  email: '',
  address: '',
  city: '',
  country: '',
  zip: '',
  cardNumber: '',
  savedCards: [],
  isSubscribed: false,
  purchaseHistory: []
}

export const useUserStore = defineStore('user', () => {
  const isLoggedIn = ref(false)
  const bookmarks = ref<string[]>([]) // Array of image IDs
  const cart = ref<CartItem[]>([])
  const activeEmail = ref('')
  
  const account = ref<UserAccount>({
    name: 'Balage Balogh',
    email: 'balage@archaeologyillustrated.com',
    address: '123 History Lane',
    city: 'Budapest',
    country: 'Hungary',
    zip: '1000',
    cardNumber: '**** **** **** 1234',
    savedCards: [
        { id: '1', last4: '1234', brand: 'visa' }
    ],
    isSubscribed: true,
    purchaseHistory: [
      { date: new Date('2023-11-20'), title: 'Roman Forum Reconstruction', price: 90 },
      { date: new Date('2023-05-15'), title: 'Roman Longship', price: 60 }
    ]
  })

  const applyServerProfile = (profile: {
    name: string
    email: string
    address: string
    city: string
    country: string
    zip: string
    cardNumber: string
    isSubscribed: boolean
  }) => {
    account.value = {
      ...account.value,
      ...profile,
      savedCards: account.value.savedCards,
      purchaseHistory: account.value.purchaseHistory
    }
  }

  const persistActiveEmail = (email: string) => {
    if (import.meta.client) {
      if (email) {
        localStorage.setItem(USER_EMAIL_STORAGE_KEY, email)
      } else {
        localStorage.removeItem(USER_EMAIL_STORAGE_KEY)
      }
    }
  }

  async function fetchProfile(email: string) {
    const response = await $fetch<{ user: {
      name: string
      email: string
      address: string
      city: string
      country: string
      zip: string
      cardNumber: string
      isSubscribed: boolean
    } }>('/api/user/profile', {
      query: { email }
    })

    applyServerProfile(response.user)
  }

  if (import.meta.client) {
    const storedEmail = localStorage.getItem(USER_EMAIL_STORAGE_KEY)
    if (storedEmail) {
      activeEmail.value = storedEmail
      isLoggedIn.value = true
      fetchProfile(storedEmail).catch(() => {
        logout()
      })
    }
  }

  // Bookmarks logic
  function toggleBookmark(imageId: string) {
    if (!isLoggedIn.value) return
    const index = bookmarks.value.indexOf(imageId)
    if (index === -1) {
      bookmarks.value.push(imageId)
    } else {
      bookmarks.value.splice(index, 1)
    }
  }

  function isBookmarked(imageId: string) {
    return bookmarks.value.includes(imageId)
  }

  // Cart logic
  function addToCart(image: ImageItem, price: ImagePrice) {
    cart.value.push({ image, price })
  }

  function removeFromCart(index: number) {
    cart.value.splice(index, 1)
  }

  const cartTotal = computed(() => {
    return cart.value.reduce((total, item) => total + item.price.price, 0)
  })

  async function login(payload?: LoginPayload) {
    if (!payload?.email) {
      isLoggedIn.value = true
      return
    }

    const response = await $fetch<{ success: boolean, user: {
      name: string
      email: string
      address: string
      city: string
      country: string
      zip: string
      cardNumber: string
      isSubscribed: boolean
    } | null }>('/api/user/login', {
      method: 'POST',
      body: payload
    })

    if (response.user) {
      applyServerProfile(response.user)
      activeEmail.value = response.user.email
      isLoggedIn.value = true
      persistActiveEmail(response.user.email)
    }
  }

  function logout() {
    isLoggedIn.value = false
    activeEmail.value = ''
    persistActiveEmail('')
  }

  async function saveAccount() {
    if (!account.value.email) return

    await $fetch('/api/user/profile', {
      method: 'PUT',
      body: {
        name: account.value.name,
        email: account.value.email,
        address: account.value.address,
        city: account.value.city,
        country: account.value.country,
        zip: account.value.zip,
        cardNumber: account.value.cardNumber,
        isSubscribed: account.value.isSubscribed
      }
    })
  }

  function updateCard(newCardNumber: string) {
    // Basic masking simulation
    const lastFour = newCardNumber.slice(-4)
    account.value.cardNumber = `**** **** **** ${lastFour}`
    // Also push to saved cards if not exists
    if (!account.value.savedCards.some(c => c.last4 === lastFour)) {
        account.value.savedCards.push({
            id: Date.now().toString(),
            last4: lastFour,
            brand: 'visa' // Mock
        })
    }
  }

  async function deleteAccount() {
    if (account.value.email) {
      await $fetch('/api/user/profile', {
        method: 'DELETE',
        body: { email: account.value.email }
      })
    }

    isLoggedIn.value = false
    activeEmail.value = ''
    persistActiveEmail('')
    bookmarks.value = []
    cart.value = []
    account.value = { ...defaultAccountState }
  }

  return {
    isLoggedIn,
    bookmarks,
    cart,
    account,
    toggleBookmark,
    isBookmarked,
    addToCart,
    removeFromCart,
    cartTotal,
    login,
    logout,
    saveAccount,
    deleteAccount,
    updateCard
  }
})
