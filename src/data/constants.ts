// Application Constants

// Pricing
export const DRIVER_FEE_PER_DAY = 150000;
export const MIN_RENTAL_DAYS = 1;

// Validation Limits
export const MAX_MESSAGE_LENGTH = 1000;
export const MAX_REVIEW_LENGTH = 500;

// localStorage Keys
export const STORAGE_KEYS = {
  BOOKINGS: 'rental_bookings',
  CONTACT_MESSAGES: 'contact_messages',
  FILTERS: 'vehicle_filters',
} as const;

// Performance Thresholds (in milliseconds)
export const PERFORMANCE_THRESHOLDS = {
  SEARCH_RESPONSE_TIME: 500,
  AVAILABILITY_CHECK_TIME: 1000,
  PAGE_LOAD_TIME: 2000,
  HOMEPAGE_LOAD_TIME: 3000,
} as const;

// UI Constants
export const MIN_TOUCH_TARGET_SIZE = 44; // pixels
export const TESTIMONIALS_ON_HOMEPAGE = 5;

// Breakpoints (matching Tailwind CSS defaults)
export const BREAKPOINTS = {
  MOBILE: 320,
  TABLET: 640,
  DESKTOP: 1024,
  LARGE_DESKTOP: 1280,
} as const;
