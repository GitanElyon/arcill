<template>
  <div class="faq-view page-container">
    <h1>Frequently Asked Questions</h1>
    
    <div class="faq-list">
      <div v-for="(item, index) in faqs" :key="index" class="faq-item">
        <h2>{{ item.question }}</h2>
        <p>{{ item.answer }}</p>
      </div>
    </div>

    <div class="faq-footer">
        <p>Still have questions? We're here to help.</p>
        <router-link to="/contact" class="btn-primary">Contact Support</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
const faqs = [
  {
    question: "How do I purchase an image?",
    answer: "Browse our collection in the 'Collections' tab. Once you find an image, click on it to see the available licenses and resolutions. You can then select 'Buy Now' to proceed directly to payment or 'Add to Cart' to continue shopping."
  },
  {
    question: "Do you offer sales or discounts?",
    answer: "Yes, we offer periodic discounts and promotions. Subscribe to our newsletter to stay updated on the latest deals."
  },
  {
    question: "What are the licensing terms?",
    answer: "Every purchase includes a standard license for non-commercial editorial, educational, or personal use. For larger print runs, book covers, or commercial advertising, please contact us for an extended license agreement."
  },
  {
    question: "Do you offer custom commissions?",
    answer: "Yes! Balage Balogh frequently works with museums, researchers, and authors on custom archaeological reconstructions. You can initiate a commission request through our Contact page."
  },
  {
    question: "What file formats will I receive?",
    answer: "Most digital downloads are provided as high-quality JPEGs. These images can be selected in your prefered resolution"
  },
  {
      question: "How can I use these images?",
      answer: "The images can be used one time display as illustrations in books, articles, presentations, or educational materials, in accordance with the licensing terms provided at purchase. They cannot be resold, redistributed, or used in derivative works without permission."
  },
  {
      question: "What is your refund policy?",
      answer: "Due to the digital nature of our products, we do not offer refunds after a purchase is completed. If you encounter any issues with your download or have questions about your order, please contact our support team for assistance."
  }
]
</script>

<style scoped src="@/assets/css/faq-view.css"></style>
