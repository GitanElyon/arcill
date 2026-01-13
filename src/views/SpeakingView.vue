<template>
  <div class="speaking-container page-container">
    <div class="header-section">
      <h1>Speaking Engagements</h1>
      <p class="intro">Invite Balage Balogh to speak at your next event, conference, or gathering.</p>
      <router-link to="/contact" class="btn-primary">Book Now</router-link>
    </div>

    <div class="speaking-layout">
      <!-- Main Content -->
      <div class="content-sections">
          
        <section class="section-block">
          <div class="section-header">
            <h2>Presentation Topics</h2>
            <p>Engaging, visually-driven presentations on history and art.</p>
          </div>
          
          <ul class="topic-list">
              <li class="topic-item">
                  <h3>Biblical Context</h3>
                  <p>Exploring the historical and archaeological background of Biblical narratives with detailed reconstructions.</p>
              </li>
              <li class="topic-item">
                  <h3>Historical Reconstruction</h3>
                  <p>The technical and artistic process of rebuilding the past from ruins, interpreting data into art.</p>
              </li>
              <li class="topic-item">
                  <h3>Ancient Daily Life</h3>
                  <p>Visualizing how people lived, worked, and worshipped in antiquity, bringing the human element to history.</p>
              </li>
              <li class="topic-item">
                  <h3>Period Deep Dives</h3>
                  <p>Detailed explorations of specific eras: Roman Empire, Ancient Egypt, or Medieval Architecture.</p>
              </li>
          </ul>
        </section>
        <hr>
        <section class="section-block alt-bg">
          <div class="section-header">
            <h2>More details</h2>
            <p>Balage has extensive experience presenting to diverse audiences.</p>
            
          </div>
          <div class="text-content">
            <p>
                Whether addressing academic conferences, church groups, or museum visitors, Balage tailors his presentations to engage and inspire.
                His talks combine stunning visuals with scholarly insight, making ancient history accessible and relevant.
                Attendees leave with a deeper appreciation for the ancient world and its enduring impact on our lives today.
            </p>
            <p>
                Past speaking engagements include university lectures, church seminars, and museum talks.
                Balage is happy to customize his presentations to fit your event's theme and audience.
                Please reach out via the Contact page to discuss your event and how Balage can contribute.
            </p>
          </div>
        </section>
        <hr>
        <section class="section-block">
          <div class="section-header">
              <h2>What Organizers Say</h2>
          </div>
          <div class="testimonials-grid">
            <div class="testimonial-card">
              <p>"Balage's presentation brought the ancient world to life in a way our students had never seen before. Truly inspiring!"</p>
              <cite>- Pamela Mandell, Masters Sumerology</cite>
            </div>
            <div class="testimonial-card">
              <p>"The visual detail and historical accuracy were astounding. Our congregation is still talking about it weeks later."</p>
              <cite>- Some homeless guy I payed</cite>
            </div>
          </div>
        </section>

      </div>
    </div>
  </div>
</template>

<style scoped src="@/assets/css/speaking-view.css"></style>
