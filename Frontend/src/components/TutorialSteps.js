// Tutorial steps configuration for the landing page
export const landingPageTutorialSteps = [
  {
    id: 'welcome',
    target: '.landing-page-container',
    title: 'Welcome to LocalsLocalMarket! 🎉',
    description: 'Let\'s take a quick tour to help you discover local shops and businesses in your area.',
    placement: 'top',
    action: 'This tutorial will show you how to search, navigate the map, and explore shops.'
  },
  {
    id: 'search-bar',
    target: '[data-tutorial="search-bar"]',
    title: 'Search for Shops & Services 🔍',
    description: 'Use this search bar to find shops, products, or services. You can search by shop name, category, location, or any keyword.',
    placement: 'bottom',
    action: 'Try typing "restaurant", "grocery", or any shop name to see results!'
  },
  {
    id: 'map-view',
    target: '[data-tutorial="map-container"]',
    title: 'Interactive Map 🗺️',
    description: 'This map shows all the shops in your area. You can click on shop markers to view details, or click anywhere on the map to pin a location.',
    placement: 'left',
    action: 'Click on any shop marker to see shop information and visit their page.'
  },
  {
    id: 'shop-cards',
    target: '[data-tutorial="shop-cards"]',
    title: 'Shop Cards 📋',
    description: 'Browse through shop cards to see photos, ratings, locations, and details. Click on any card to visit the shop\'s full page.',
    placement: 'right',
    action: 'Each card shows the shop\'s logo, cover image, rating, and distance from you.'
  },
  {
    id: 'map-controls',
    target: '[data-tutorial="map-controls"]',
    title: 'Map Controls ⚙️',
    description: 'Use these controls to expand the map for a better view, or refresh if the map isn\'t loading properly.',
    placement: 'bottom',
    action: 'The expand button makes the map larger, and the refresh button reloads the map.'
  },
  {
    id: 'location-pinning',
    target: '[data-tutorial="map-container"]',
    title: 'Pin Locations 📍',
    description: 'Click anywhere on the map to pin a location. Shops will be sorted by distance from your pinned location.',
    placement: 'bottom',
    action: 'This helps you find shops near a specific area you\'re interested in.'
  },
  {
    id: 'mobile-map',
    target: '[data-tutorial="mobile-map-btn"]',
    title: 'Mobile Map Access 📱',
    description: 'On mobile devices, use this floating button to open the map in a full-screen modal for easier navigation.',
    placement: 'right',
    action: 'Tap the map button to open a larger, more interactive map view.'
  },
  {
    id: 'completion',
    target: '.landing-page-container',
    title: 'You\'re All Set! 🚀',
    description: 'You now know how to search for shops, use the interactive map, and explore local businesses. Start discovering amazing shops in your community!',
    placement: 'center',
    action: 'Happy shopping and supporting local businesses!'
  }
]

// Tutorial steps for seller dashboard
export const dashboardTutorialSteps = [
  {
    id: 'dashboard-welcome',
    target: '.seller-dashboard-container',
    title: 'Welcome to Your Seller Dashboard! 🎉',
    description: 'This is your command center for managing all your shops and products on LocalsLocalMarket.',
    placement: 'center',
    action: 'Let\'s explore the key features to help you succeed as a seller.'
  },
  {
    id: 'create-shop-button',
    target: '[data-tutorial="create-shop-btn"]',
    title: 'Create Your First Shop 🏪',
    description: 'Start by creating a shop to showcase your products or services. Click this button to begin the shop creation process.',
    placement: 'bottom',
    action: 'You\'ll be able to add shop details, upload images, and set your location.'
  },
  {
    id: 'shops-grid',
    target: '[data-tutorial="shops-grid"]',
    title: 'Your Shops Overview 📋',
    description: 'All your shops will appear here as cards. You can view, edit, manage, or delete shops from this dashboard.',
    placement: 'bottom',
    action: 'Each shop card shows your logo, cover image, and quick action buttons.'
  },
  {
    id: 'shop-actions',
    target: '[data-tutorial="shop-actions"]',
    title: 'Shop Management Actions ⚙️',
    description: 'Each shop has four key actions: View (see your public shop), Manage (add/edit products), Edit (update shop details), and Delete.',
    placement: 'right',
    action: 'Use "Manage Shop" to add products and services to your shop.'
  },
  {
    id: 'no-shops-state',
    target: '[data-tutorial="no-shops-state"]',
    title: 'Ready to Start Selling? 🚀',
    description: 'If you don\'t have any shops yet, you\'ll see this helpful prompt to create your first shop.',
    placement: 'center',
    action: 'Click "Create Your First Shop" to get started with selling on the platform.'
  }
]

// Tutorial steps for shop management page
export const shopManagementTutorialSteps = [
  {
    id: 'management-header',
    target: '[data-tutorial="management-header"]',
    title: 'Shop Management Center 🛠️',
    description: 'This is where you manage all products and services for your shop. You can add, edit, and organize your inventory here.',
    placement: 'bottom',
    action: 'Use the tabs below to switch between Products and Services.'
  },
  {
    id: 'add-item-button',
    target: '[data-tutorial="add-item-btn"]',
    title: 'Add New Items ➕',
    description: 'Click this button to add new products or services to your shop. You can upload images, set prices, and add descriptions.',
    placement: 'bottom',
    action: 'This button changes based on which tab you\'re viewing (Products or Services).'
  },
  {
    id: 'tab-navigation',
    target: '[data-tutorial="tab-navigation"]',
    title: 'Switch Between Products & Services 📦',
    description: 'Use these tabs to manage different types of items. Products are physical items you sell, while Services are things you offer.',
    placement: 'bottom',
    action: 'The numbers show how many items you have in each category.'
  },
  {
    id: 'search-filters',
    target: '[data-tutorial="search-filters"]',
    title: 'Find Your Items 🔍',
    description: 'Use the search bar and filters to quickly find specific products or services in your shop.',
    placement: 'bottom',
    action: 'Filter by category, status, or search by name to manage large inventories.'
  },
  {
    id: 'item-cards',
    target: '[data-tutorial="item-cards"]',
    title: 'Your Items Grid 📋',
    description: 'All your products and services are displayed here as cards. You can edit, delete, or manage stock for each item.',
    placement: 'bottom',
    action: 'Click on any item card to edit its details or manage its availability.'
  }
]

// Tutorial steps for shop page
export const shopPageTutorialSteps = [
  {
    id: 'shop-header',
    target: '[data-tutorial="shop-header"]',
    title: 'Shop Information 🏪',
    description: 'Here you can see the shop\'s name, description, contact details, and location information.',
    placement: 'bottom',
    action: 'Scroll down to see more details about this shop.'
  },
  {
    id: 'products-services-tabs',
    target: '[data-tutorial="products-services-tabs"]',
    title: 'Products & Services 📦',
    description: 'Switch between products and services. Some shops show only one. If both are available, the first tab matches the shop\'s preference.',
    placement: 'bottom',
    action: 'Click on "Products" or "Services" to see what\'s available.'
  },
  {
    id: 'add-to-cart-button',
    target: '[data-tutorial="add-to-cart-btn"]',
    title: 'Add to Cart 🛒',
    description: 'Click this button to add items to your cart without immediately ordering. You can add multiple items and review them later.',
    placement: 'top',
    action: 'Try adding a product or service to your cart to see how it works!'
  },
  {
    id: 'order-now-button',
    target: '[data-tutorial="order-now-btn"]',
    title: 'Order Now ⚡',
    description: 'Click this button to immediately add an item to your cart and open the ordering form. Perfect for quick purchases.',
    placement: 'top',
    action: 'Use "Order Now" when you\'re ready to purchase an item right away.'
  },
  {
    id: 'review-button',
    target: '[data-tutorial="review-btn"]',
    title: 'Review This Shop ⭐',
    description: 'Click this button to leave a star rating and review for this shop. Your feedback helps other customers make informed decisions.',
    placement: 'bottom',
    action: 'You can rate the shop from 1 to 5 stars and add optional comments about your experience.'
  },
  {
    id: 'floating-cart-button',
    target: '[data-tutorial="floating-cart-btn"]',
    title: 'Your Shopping Cart 🛍️',
    description: 'This floating cart button shows how many items you have. Click it to view your cart, adjust quantities, or place your order.',
    placement: 'left',
    action: 'The number in parentheses shows your total items. Click to manage your cart!'
  },
  {
    id: 'cart-management',
    target: '[data-tutorial="cart-management"]',
    title: 'Cart Management 🔧',
    description: 'In your cart, you can adjust quantities, remove items, and see the total price. Everything is saved automatically.',
    placement: 'top',
    action: 'Use the + and - buttons to change quantities, or click "Remove" to delete items.'
  },
  {
    id: 'place-order',
    target: '[data-tutorial="place-order-btn"]',
    title: 'Place Your Order 📝',
    description: 'When ready, click "Place Order" to finalize your purchase. You\'ll need to provide your email and any special instructions.',
    placement: 'top',
    action: 'The shop will contact you via email to confirm details and arrange payment/delivery.'
  },
  {
    id: 'order-confirmation',
    target: '[data-tutorial="order-confirmation"]',
    title: 'Order Confirmation ✅',
    description: 'After placing your order, you\'ll see a confirmation message. The shop owner will contact you to arrange payment and delivery.',
    placement: 'center',
    action: 'Keep your email handy - the shop will reach out to you soon!'
  },
  {
    id: 'contact-info',
    target: '[data-tutorial="contact-info"]',
    title: 'Contact & Visit 🚶‍♂️',
    description: 'Find the shop\'s phone number, email, address, and business hours. Use the directions button to get navigation help.',
    placement: 'left',
    action: 'You can also call or visit the shop directly for in-person purchases.'
  },
  {
    id: 'reviews',
    target: '[data-tutorial="reviews"]',
    title: 'Customer Reviews ⭐',
    description: 'Read what other customers have to say about this shop. Reviews help you make informed decisions.',
    placement: 'top',
    action: 'Look for reviews that mention the products or services you\'re interested in.'
  }
]

// Helper function to get tutorial steps based on current page
export const getTutorialSteps = (pathname) => {
  if (pathname === '/') {
    return landingPageTutorialSteps
  } else if (pathname === '/dashboard') {
    return dashboardTutorialSteps
  } else if (pathname.startsWith('/shop-management/')) {
    return shopManagementTutorialSteps
  } else if (pathname.startsWith('/shops/') && !pathname.includes('/edit')) {
    // Dynamically adjust steps later using runtime filter based on offering type
    return shopPageTutorialSteps
  }
  return []
}

// Helper function to check if tutorial should be shown on current page
export const shouldShowTutorial = (pathname) => {
  const supportedPages = ['/', '/dashboard', '/shop-management/', '/shops/']
  return supportedPages.some(page => {
    if (page === '/') return pathname === '/'
    if (page === '/dashboard') return pathname === '/dashboard'
    if (page === '/shop-management/') return pathname.startsWith('/shop-management/')
    if (page === '/shops/') return pathname.startsWith('/shops/') && !pathname.includes('/edit')
    return false
  })
}
