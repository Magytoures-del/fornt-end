# SSR (Special Service Requests) Components

This directory contains React components for handling Special Service Requests in flight booking, including extra baggage selection, meal preferences, and seat selection.

## Components

### 1. ExtraBaggageSelector

A component for selecting additional baggage options with different weight limits and pricing.

**Props:**

- `value` (string): Currently selected baggage option ID
- `onChange` (function): Callback when selection changes
- `baggageOptions` (array, optional): Custom baggage options
- `error` (string, optional): Error message to display
- `disabled` (boolean, optional): Whether the component is disabled

**Default Options:**

- No Extra Baggage (0 kg, included)
- Small Baggage (5 kg, +25 SAR)
- Medium Baggage (10 kg, +45 SAR)
- Large Baggage (20 kg, +75 SAR)
- Extra Large Baggage (32 kg, +120 SAR)

### 2. MealSelector

A component for selecting special meal preferences with various dietary options.

**Props:**

- `value` (string): Currently selected meal option ID
- `onChange` (function): Callback when selection changes
- `mealOptions` (array, optional): Custom meal options
- `error` (string, optional): Error message to display
- `disabled` (boolean, optional): Whether the component is disabled

**Default Options:**

- No Special Meal (included)
- Vegetarian Meal (+15 SAR)
- Hindu Meal (+15 SAR)
- Halal Meal (+15 SAR)
- Kosher Meal (+20 SAR)
- Diabetic Meal (+15 SAR)
- Gluten Free Meal (+15 SAR)
- Seafood Meal (+20 SAR)
- Child Meal (+10 SAR)

### 3. SeatSelector

A component for selecting seat preferences and specific seats with an interactive seat map.

**Props:**

- `value` (string): Currently selected seat option ID
- `onChange` (function): Callback when selection changes
- `seatOptions` (array, optional): Custom seat options
- `seatMap` (array, optional): Custom seat map data
- `error` (string, optional): Error message to display
- `disabled` (boolean, optional): Whether the component is disabled

**Default Options:**

- No Preference (included)
- Window Seat (+25 SAR)
- Aisle Seat (+25 SAR)
- Middle Seat (+15 SAR)
- Front Seat (+35 SAR)
- Exit Row Seat (+50 SAR)

### 4. SSRSelector

A combined component that includes all three SSR selectors in one convenient package.

### 5. BaggageModal

A popup modal version of the ExtraBaggageSelector component.

**Props:**

- `isOpen` (boolean): Whether the modal is open
- `onClose` (function): Callback when modal should close
- `value` (string): Currently selected baggage option ID
- `onChange` (function): Callback when selection changes
- `baggageOptions` (array, optional): Custom baggage options
- `error` (string, optional): Error message to display
- `disabled` (boolean, optional): Whether the component is disabled

### 6. MealModal

A popup modal version of the MealSelector component.

**Props:**

- `isOpen` (boolean): Whether the modal is open
- `onClose` (function): Callback when modal should close
- `value` (string): Currently selected meal option ID
- `onChange` (function): Callback when selection changes
- `mealOptions` (array, optional): Custom meal options
- `error` (string, optional): Error message to display
- `disabled` (boolean, optional): Whether the component is disabled

### 7. SeatModal

A popup modal version of the SeatSelector component.

**Props:**

- `isOpen` (boolean): Whether the modal is open
- `onClose` (function): Callback when modal should close
- `value` (string): Currently selected seat option ID
- `onChange` (function): Callback when selection changes
- `seatOptions` (array, optional): Custom seat options
- `seatMap` (array, optional): Custom seat map data
- `error` (string, optional): Error message to display
- `disabled` (boolean, optional): Whether the component is disabled

### 8. SSRModalSelector

A combined component that displays three clickable cards with icons, each opening a popup modal for selection.

**Props:**

- `baggageValue` (string): Currently selected baggage option
- `onBaggageChange` (function): Callback for baggage changes
- `mealValue` (string): Currently selected meal option
- `onMealChange` (function): Callback for meal changes
- `seatValue` (string): Currently selected seat option
- `onSeatChange` (function): Callback for seat changes
- `baggageOptions` (array, optional): Custom baggage options
- `mealOptions` (array, optional): Custom meal options
- `seatOptions` (array, optional): Custom seat options
- `seatMap` (array, optional): Custom seat map data
- `errors` (object, optional): Error messages for each component
- `disabled` (boolean, optional): Whether all components are disabled
- `showTitle` (boolean, optional): Whether to show the section title

## Usage Examples

### Basic Usage

```jsx
import ExtraBaggageSelector from "./ExtraBaggageSelector";
import MealSelector from "./MealSelector";
import SeatSelector from "./SeatSelector";

function MyComponent() {
  const [baggage, setBaggage] = useState("none");
  const [meal, setMeal] = useState("none");
  const [seat, setSeat] = useState("no_preference");

  return (
    <div>
      <ExtraBaggageSelector value={baggage} onChange={setBaggage} />

      <MealSelector value={meal} onChange={setMeal} />

      <SeatSelector value={seat} onChange={setSeat} />
    </div>
  );
}
```

### Using the Combined Component

```jsx
import SSRSelector from "./SSRSelector";

function MyComponent() {
  const [formData, setFormData] = useState({
    baggage: "none",
    meal: "none",
    seat: "no_preference",
  });

  return (
    <SSRSelector
      baggageValue={formData.baggage}
      onBaggageChange={(value) =>
        setFormData((prev) => ({ ...prev, baggage: value }))
      }
      mealValue={formData.meal}
      onMealChange={(value) =>
        setFormData((prev) => ({ ...prev, meal: value }))
      }
      seatValue={formData.seat}
      onSeatChange={(value) =>
        setFormData((prev) => ({ ...prev, seat: value }))
      }
    />
  );
}
```

### Using Popup Modals

```jsx
import SSRModalSelector from "./SSRModalSelector";

function MyComponent() {
  const [formData, setFormData] = useState({
    baggage: "none",
    meal: "none",
    seat: "no_preference",
  });

  return (
    <SSRModalSelector
      baggageValue={formData.baggage}
      onBaggageChange={(value) =>
        setFormData((prev) => ({ ...prev, baggage: value }))
      }
      mealValue={formData.meal}
      onMealChange={(value) =>
        setFormData((prev) => ({ ...prev, meal: value }))
      }
      seatValue={formData.seat}
      onSeatChange={(value) =>
        setFormData((prev) => ({ ...prev, seat: value }))
      }
    />
  );
}
```

### Using Individual Modals

```jsx
import { useState } from "react";
import BaggageModal from "./BaggageModal";
import MealModal from "./MealModal";
import SeatModal from "./SeatModal";

function MyComponent() {
  const [baggageModalOpen, setBaggageModalOpen] = useState(false);
  const [mealModalOpen, setMealModalOpen] = useState(false);
  const [seatModalOpen, setSeatModalOpen] = useState(false);

  const [baggage, setBaggage] = useState("none");
  const [meal, setMeal] = useState("none");
  const [seat, setSeat] = useState("no_preference");

  return (
    <div>
      <button onClick={() => setBaggageModalOpen(true)}>
        Select Baggage 🧳
      </button>
      <button onClick={() => setMealModalOpen(true)}>Select Meal 🍽️</button>
      <button onClick={() => setSeatModalOpen(true)}>Select Seat 🪑</button>

      <BaggageModal
        isOpen={baggageModalOpen}
        onClose={() => setBaggageModalOpen(false)}
        value={baggage}
        onChange={setBaggage}
      />

      <MealModal
        isOpen={mealModalOpen}
        onClose={() => setMealModalOpen(false)}
        value={meal}
        onChange={setMeal}
      />

      <SeatModal
        isOpen={seatModalOpen}
        onClose={() => setSeatModalOpen(false)}
        value={seat}
        onChange={setSeat}
      />
    </div>
  );
}
```

### With React Hook Form

```jsx
import { useForm, Controller } from "react-hook-form";
import SSRSelector from "./SSRSelector";

function MyForm() {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      baggage: "none",
      meal: "none",
      seat: "no_preference",
    },
  });

  const onSubmit = (data) => {
    console.log("Form data:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="baggage"
        control={control}
        render={({ field }) => (
          <ExtraBaggageSelector value={field.value} onChange={field.onChange} />
        )}
      />

      <Controller
        name="meal"
        control={control}
        render={({ field }) => (
          <MealSelector value={field.value} onChange={field.onChange} />
        )}
      />

      <Controller
        name="seat"
        control={control}
        render={({ field }) => (
          <SeatSelector value={field.value} onChange={field.onChange} />
        )}
      />

      <button type="submit">Submit</button>
    </form>
  );
}
```

## Customization

### Custom Options

You can provide custom options for any of the components:

```jsx
const customBaggageOptions = [
  {
    id: "premium",
    type: "premium_baggage",
    weight: "40 kg",
    price: 200,
    description: "passenger_form.baggage.premium_description",
  },
];

<ExtraBaggageSelector
  value={baggage}
  onChange={setBaggage}
  baggageOptions={customBaggageOptions}
/>;
```

### Custom Seat Map

```jsx
const customSeatMap = [
  { number: "1A", occupied: false, available: true },
  { number: "1B", occupied: true, available: false },
  // ... more seats
];

<SeatSelector value={seat} onChange={setSeat} seatMap={customSeatMap} />;
```

## Styling

All components use styled-components and can be customized by passing custom styled components or by modifying the base styles. The components are designed to be responsive and work well on both desktop and mobile devices.

## Internationalization

All text content is handled through the i18n translation system. Make sure to include the necessary translation keys in your translation files:

- `passenger_form.baggage.*`
- `passenger_form.meals.*`
- `passenger_form.seats.*`
- `passenger_form.fields.*`

## Dependencies

- React
- styled-components
- react-i18next (for translations)

## Browser Support

These components support all modern browsers and are built with accessibility in mind, including proper ARIA labels and keyboard navigation support.
