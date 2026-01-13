<template>
  <div class="contact-container page-container">
    <h1>Contact Us</h1>
    <p class="intro">Have questions or interested in a commission? Fill out the form below.</p>

    <div class="contact-layout">
        <form class="contact-form" @submit.prevent="submitForm">
          <div class="form-group">
            <label for="name">Name</label>
            <input type="text" id="name" v-model="form.name" required>
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="form.email" required>
            <span v-if="emailError" class="error-text">{{ emailError }}</span>
          </div>

          <div class="form-group">
            <label for="message">Message</label>
            <textarea id="message" v-model="form.message" rows="5" required></textarea>
          </div>

          <button type="submit" class="submit-btn full-width" :disabled="isSubmitting">
            {{ isSubmitting ? 'Sending...' : 'Send Message' }}
          </button>
        </form>

        <aside class="contact-info">
            <div class="info-card">
                <h3>Get in Touch</h3>
                <p>We'd love to hear from you. Feel free to reach out directly.</p>
                
                <div class="info-item">
                    <strong>Email:</strong>
                    <a href="mailto:balage@archaeologyillustrated.com">balage@archaeologyillustrated.com</a>
                </div>
                
                <div class="info-item">
                    <strong>Phone:</strong>
                    <span>(443) 527-4300</span>
                </div>

                <div class="info-item">
                    <strong>Location:</strong>
                    <span>Baltimore, Maryland, USA</span>
                </div>
            </div>

            <div class="info-card" style="margin-top: 2rem;">
                <h3>Studio Visits</h3>
                <p>By appointment only.</p>
                <div class="info-item">
                     <strong>Hours:</strong>
                     <span>Mon-Fri, 10am - 4pm</span>
                </div>
                <div class="info-item">
                     <strong>Address:</strong>
                     <span><i>Available upon request</i></span>
                </div>
            </div>
        </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useNotificationStore } from '../stores/notifications'

const notificationStore = useNotificationStore()
const isSubmitting = ref(false)
const emailError = ref('')

const form = reactive({
  name: '',
  email: '',
  message: ''
})

function validateEmail(email: string) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
}

async function submitForm() {
  emailError.value = ''
  
  if (!validateEmail(form.email)) {
      emailError.value = 'Please enter a valid email address.'
      return
  }

  isSubmitting.value = true
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  notificationStore.add('success', 'Message sent successfully! We will get back to you soon.')
  isSubmitting.value = false
  form.name = ''
  form.email = ''
  form.message = ''
}
</script>

<style scoped>
.contact-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

h1 {
    text-align: center;
    margin-bottom: 0.5rem;
}

.intro {
    text-align: center;
    color: var(--color-text-light);
    margin-bottom: 3rem;
}

.contact-layout {
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: 3rem;
}

@media (max-width: 768px) {
    .contact-layout {
        grid-template-columns: 1fr;
    }
}

.contact-form {
    background-color: var(--color-background-soft);
    padding: 2rem;
    border-radius: 8px;
    border: 1px solid var(--color-border);
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
}

.form-group input, .form-group textarea {
    width: 100%;
    padding: 0.8rem;
    background-color: var(--color-background);
    border: 1px solid var(--color-border);
    border-radius: 4px;
    color: var(--color-text);
}

.error-text {
    color: #e53935;
    font-size: 0.85rem;
    margin-top: 0.25rem;
    display: block;
}

.submit-btn {
    width: 100%;
    padding: 1rem;
    background-color: #42b883;
    color: white;
    border: none;
    border-radius: 4px;
    font-weight: bold;
    cursor: pointer;
    font-size: 1rem;
}

.submit-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.info-card {
    background-color: var(--color-background-soft);
    padding: 1.5rem;
    border-radius: 8px;
    border: 1px solid var(--color-border);
}

.info-card h3 {
    margin-bottom: 1rem;
    color: #42b883;
}

.info-card p {
    margin-bottom: 1.5rem;
    color: var(--color-text-light);
    font-size: 0.9rem;
}

.info-item {
    margin-bottom: 1rem;
}

.info-item strong {
    display: block;
    color: var(--color-heading);
    margin-bottom: 0.2rem;
}

.info-item a {
    color: #42b883;
    text-decoration: none;
}
</style>
