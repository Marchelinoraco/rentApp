# Website Rental Mobil

Website rental mobil frontend-only application built with React, TypeScript, Vite, and Tailwind CSS.

## Features

- 🚗 Vehicle catalog with search, filter, and sort
- 📅 Booking form with availability checking
- 💰 Real-time price calculation
- ⭐ Customer testimonials
- 📱 Fully responsive design
- ♿ Accessibility compliant
- 🧪 Comprehensive testing (unit, property-based, component, integration)

## Tech Stack

- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Form Management**: React Hook Form + Zod
- **Testing**: Vitest + Testing Library + fast-check
- **Date Handling**: date-fns
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run unit tests only
npm run test:unit

# Run property-based tests only
npm run test:properties

# Run component tests only
npm run test:components

# Generate coverage report
npm run test:coverage

# Lint code
npm run lint
```

## Project Structure

```
src/
├── components/       # React components
│   ├── layout/      # Header, Footer, Layout
│   ├── vehicle/     # Vehicle-related components
│   ├── booking/     # Booking-related components
│   ├── testimonial/ # Testimonial components
│   ├── contact/     # Contact form components
│   └── ui/          # Reusable UI components
├── pages/           # Page components
├── data/            # Mock data and constants
├── store/           # Zustand store
├── utils/           # Utility functions
├── hooks/           # Custom React hooks
├── types/           # TypeScript type definitions
├── routes/          # Route configuration
└── test/            # Test setup

tests/
├── unit/            # Unit tests
├── properties/      # Property-based tests
├── components/      # Component tests
└── integration/     # Integration tests
```

## Key Design Decisions

- **Frontend-Only**: No backend API, uses mock data and localStorage
- **Mock Data**: Vehicle and testimonial data stored as constants
- **localStorage**: Booking and contact form data persisted in browser
- **Component-Based**: Reusable components for maintainability
- **Type-Safe**: TypeScript with strict mode enabled
- **Accessible**: WCAG AA compliant with keyboard navigation
- **Responsive**: Mobile-first design (320px - 2560px)
- **Tested**: Property-based testing for correctness guarantees

## Testing Strategy

- **Property-Based Testing**: 26 correctness properties using fast-check
- **Unit Tests**: Edge cases and specific scenarios
- **Component Tests**: UI behavior and user interactions
- **Integration Tests**: End-to-end user flows

## License

Private project
