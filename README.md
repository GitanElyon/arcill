# Archaeology Illustrated (ArcIll)

A Vue 3 + Vite e-commerce platform for archaeology illustrated. This application allows users to browse high-quality historical visualizations, purchase commercial licenses, and manage their collections.


## Project Structure

```
src/
├── assets/                 # Static assets and CSS
│   ├── css/                # View-specific and global styles
│   └── ...
├── components/             # Reusable Vue components
│   ├── LoginModal.vue      # Authentication popup
│   ├── NotificationToast.vue # Toast system
│   └── ...
├── stores/                 # Pinia State Management
│   ├── cart.ts             # Shopping cart logic (part of user.ts)
│   ├── images.ts           # Image data source
│   ├── notifications.ts    # Notification queue state
│   └── user.ts             # User profiles and settings
├── views/                  # Page Components
│   ├── AccountView.vue     # User settings and history
│   ├── CartView.vue        # Checkout flow
│   ├── CollectionsView.vue # Main gallery with filtering
│   └── ...
├── App.vue                 # Main layout and global overlays
└── main.ts                 # App entry point
```

## Setup & Development

### Project Setup
```sh
bun install
```

### Compile and Hot-Reload for Development
```sh
bun dev
```

### Type-Check, Compile and Minify for Production
```sh
bun run build
```

### Lint with [ESLint](https://eslint.org/)
```sh
bun lint
```

