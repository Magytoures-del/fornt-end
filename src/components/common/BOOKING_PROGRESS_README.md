# Booking Progress Stepper

A comprehensive progress indicator component for the flight booking process.

## Features

- **3-Step Process**: Search → Booking Details → Payment
- **Visual Progress**: Color-coded steps with icons and progress line
- **Responsive Design**: Desktop and mobile-friendly layouts
- **Internationalization**: Supports multiple languages (English/Arabic)
- **Accessibility**: Screen reader friendly
- **Smooth Animations**: CSS transitions for state changes

## Usage

### Basic Usage

```jsx
import BookingProgressStepper from "@/components/common/BookingProgressStepper";
import { BOOKING_STEPS } from "@/utils/helper";

// In your component
<BookingProgressStepper currentStep={BOOKING_STEPS.DETAILS} />;
```

### Available Steps

```jsx
import { BOOKING_STEPS } from "@/utils/helper";

BOOKING_STEPS.SEARCH; // Step 1: Search Flights
BOOKING_STEPS.DETAILS; // Step 2: Booking Details
BOOKING_STEPS.PAYMENT; // Step 3: Payment
```

### Helper Functions

```jsx
import {
  getBookingStepFromPath,
  getNextBookingStep,
  getPreviousBookingStep,
  isValidBookingStep,
} from "@/utils/helper";

// Auto-detect step from URL
const currentStep = getBookingStepFromPath(pathname);

// Navigate between steps
const nextStep = getNextBookingStep(currentStep);
const previousStep = getPreviousBookingStep(currentStep);

// Validate step
const isValid = isValidBookingStep(step);
```

### Props

| Prop          | Type     | Default | Description               |
| ------------- | -------- | ------- | ------------------------- |
| `currentStep` | `number` | `1`     | Current active step (1-3) |
| `className`   | `string` | `""`    | Additional CSS classes    |

### Examples

#### Flight Search Page

```jsx
<BookingProgressStepper currentStep={BOOKING_STEPS.SEARCH} />
```

#### Flight Details Page (Current)

```jsx
<BookingProgressStepper currentStep={BOOKING_STEPS.DETAILS} />
```

#### Payment/Checkout Page

```jsx
<BookingProgressStepper currentStep={BOOKING_STEPS.PAYMENT} />
```

### Customization

The component uses Tailwind CSS classes and can be customized by:

1. **Colors**: Modify the color classes in the component
2. **Icons**: Replace the icons with your preferred ones
3. **Layout**: Adjust the responsive grid layout
4. **Animation**: Modify transition duration and effects

### Translation Keys

Add these keys to your translation files:

```json
{
  "booking_progress": {
    "search": "Search Flights",
    "search_desc": "Find your perfect flight",
    "details": "Booking Details",
    "details_desc": "Enter passenger information",
    "payment": "Payment",
    "payment_desc": "Complete your booking"
  }
}
```

### Mobile Responsive

- **Desktop**: Horizontal stepper with progress line
- **Mobile**: Compact view with progress bar below

### State Indicators

- **Completed**: ✅ Green with checkmark
- **Active**: 🔵 Blue with ring highlight
- **Pending**: ⚪ Gray and inactive

## Integration

The component is already integrated into:

- ✅ Flight Details Page (`/flights/details/[bookId]`)

To add to other pages:

- Flight Search/Results Page (`/flights`)
- Payment/Checkout Page (`/checkout` or `/payment`)
