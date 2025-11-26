# Hotel Details - Quick Reference Guide

## 🚀 Getting Started

### Main Entry Point
```javascript
// src/app/hotels/details/page.js
import HotelDetailsPage from "@/app/hotels/details/page";
```

## 📦 Available Components

### 1. **LoadingSkeleton**
```javascript
import LoadingSkeleton from "@/components/hotels/details/LoadingSkeleton";

// Usage:
<Suspense fallback={<LoadingSkeleton />}>
  <YourContent />
</Suspense>
```

### 2. **Breadcrumb**
```javascript
import Breadcrumb from "@/components/hotels/details/Breadcrumb";

// Usage:
<Breadcrumb 
  hotelName="Grand Hotel" 
  city="Dubai" 
/>
```

### 3. **ErrorState**
```javascript
import ErrorState from "@/components/hotels/details/ErrorState";

// Usage:
<ErrorState 
  error="Failed to load data" 
  onRetry={() => retry()} 
  onBack={() => router.back()} 
/>
```

### 4. **EmptyState**
```javascript
import EmptyState from "@/components/hotels/details/EmptyState";

// Usage:
<EmptyState onBack={() => router.back()} />
```

### 5. **FloatingActions**
```javascript
import FloatingActions from "@/components/hotels/details/FloatingActions";

// Usage:
<FloatingActions
  onShare={handleShare}
  onFavorite={handleFavorite}
  isFavorite={isFavorite}
  onScrollTop={scrollToTop}
  showScrollTop={showScrollTop}
/>
```

### 6. **Toast System** ⭐ REUSABLE
```javascript
import { useToast, ToastContainer } from "@/components/common/Toast";

// In your component:
const { toasts, showToast, removeToast } = useToast();

// Show notifications:
showToast("Success message", "success", 3000);
showToast("Error message", "error", 5000);
showToast("Info message", "info");

// Render:
<ToastContainer toasts={toasts} removeToast={removeToast} />
```

## 🪝 Custom Hooks

### 1. **useHotelDetails** - Fetch Hotel Data
```javascript
import { useHotelDetails } from "@/hooks/useHotelDetails";

const { hotelData, isLoading, error, retry } = useHotelDetails(hotelId, searchId);

// Returns:
// - hotelData: Hotel information object
// - isLoading: Boolean loading state
// - error: Error message string or null
// - retry: Function to retry fetching
```

### 2. **useFavorites** - Manage Favorites ⭐ REUSABLE
```javascript
import { useFavorites } from "@/hooks/useFavorites";

const { isFavorite, toggleFavorite } = useFavorites(hotelId);

// Returns:
// - isFavorite: Boolean favorite state
// - toggleFavorite: Function to toggle favorite
```

### 3. **useScrollToTop** - Scroll Management ⭐ REUSABLE
```javascript
import { useScrollToTop } from "@/hooks/useScrollToTop";

const { showScrollTop, scrollToTop } = useScrollToTop();

// Returns:
// - showScrollTop: Boolean (true when scrollY > 400px)
// - scrollToTop: Function to scroll to top smoothly
```

## 🎯 Constants

### Using Constants
```javascript
import { 
  SCROLL_THRESHOLD, 
  ERROR_MESSAGES, 
  SUCCESS_MESSAGES,
  ANIMATION_DELAYS 
} from "@/constants/hotelDetails";

// Example:
showToast(SUCCESS_MESSAGES.LINK_COPIED, "success");
```

### Available Constants
```javascript
SCROLL_THRESHOLD = 400

ERROR_MESSAGES = {
  MISSING_IDS: "Missing hotel ID or search ID",
  INVALID_STRUCTURE: "Invalid hotel data structure",
  FETCH_FAILED: "Failed to fetch hotel details",
  NO_DATA: "No Hotel Data Available",
}

SUCCESS_MESSAGES = {
  LINK_COPIED: "Link copied to clipboard!",
  FAVORITE_ADDED: "Hotel added to favorites",
  FAVORITE_REMOVED: "Hotel removed from favorites",
}

ANIMATION_DELAYS = {
  SECTION_1: "0.1s",
  SECTION_2: "0.2s",
  SECTION_3: "0.3s",
}
```

## 💅 CSS Classes

### Animations
```css
.animate-fade-in {
  /* Fades in with slide up effect */
  /* Duration: 0.6s */
  /* Respects prefers-reduced-motion */
}
```

### Custom Scrollbar
```css
.custom-scrollbar {
  /* Custom styled scrollbar */
}
```

## 📋 Common Patterns

### 1. **Fetching and Displaying Hotel Data**
```javascript
const { hotelData, isLoading, error, retry } = useHotelDetails(hotelId, searchId);

if (isLoading) return <LoadingSkeleton />;
if (error) return <ErrorState error={error} onRetry={retry} onBack={handleBack} />;
if (!hotelData) return <EmptyState onBack={handleBack} />;

return <HotelContent data={hotelData} />;
```

### 2. **Adding Toast Notifications**
```javascript
const { toasts, showToast, removeToast } = useToast();

const handleAction = async () => {
  try {
    await performAction();
    showToast("Action completed successfully!", "success");
  } catch (error) {
    showToast("Action failed. Please try again.", "error");
  }
};

return (
  <>
    <YourComponent />
    <ToastContainer toasts={toasts} removeToast={removeToast} />
  </>
);
```

### 3. **Managing Favorites**
```javascript
const { isFavorite, toggleFavorite } = useFavorites(itemId);
const { showToast } = useToast();

const handleFavorite = () => {
  toggleFavorite();
  const message = isFavorite 
    ? "Removed from favorites" 
    : "Added to favorites";
  showToast(message, "success", 2000);
};

return (
  <button onClick={handleFavorite}>
    <Heart className={isFavorite ? "fill-current text-red-500" : ""} />
  </button>
);
```

### 4. **Scroll to Top Button**
```javascript
const { showScrollTop, scrollToTop } = useScrollToTop();

return (
  showScrollTop && (
    <button 
      onClick={scrollToTop}
      className="fixed bottom-8 right-4 z-40"
    >
      <ArrowUp />
    </button>
  )
);
```

### 5. **Share Functionality**
```javascript
const { showToast } = useToast();

const handleShare = async () => {
  const shareData = {
    title: "Hotel Name",
    text: "Check out this hotel",
    url: window.location.href,
  };

  try {
    if (navigator.share && navigator.canShare?.(shareData)) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(window.location.href);
      showToast("Link copied to clipboard!", "success");
    }
  } catch (err) {
    if (err.name !== "AbortError") {
      showToast("Failed to share", "error");
    }
  }
};
```

## 🎨 Styling Guidelines

### Color Palette
```css
Primary: blue-600, blue-700
Success: green-600
Error: red-600
Info: blue-600
Gray Scale: gray-50 to gray-900
```

### Spacing
```css
Small: gap-2, p-2, m-2
Medium: gap-4, p-4, m-4
Large: gap-6, p-6, m-6
Extra Large: gap-8, p-8, m-8
```

### Border Radius
```css
Small: rounded-lg
Medium: rounded-xl
Large: rounded-2xl
Full: rounded-full
```

### Shadows
```css
Small: shadow-sm
Medium: shadow-lg
Large: shadow-xl
```

### Transitions
```css
Standard: transition-all duration-300
Fast: transition-colors duration-200
Hover Scale: hover:scale-110
```

## 🔍 Debugging Tips

### 1. Check Hook Returns
```javascript
const hookData = useHotelDetails(hotelId, searchId);
console.log("Hook data:", hookData);
```

### 2. Verify Constants
```javascript
import * as constants from "@/constants/hotelDetails";
console.log("Constants:", constants);
```

### 3. Test Toast System
```javascript
showToast("Test message", "info");
```

### 4. Check LocalStorage
```javascript
console.log("Favorites:", localStorage.getItem("favoriteHotels"));
```

## 🚨 Common Issues & Solutions

### Issue: Hook returns null data
**Solution**: Verify hotelId and searchId are valid strings

### Issue: Toast doesn't appear
**Solution**: Ensure `<ToastContainer />` is rendered in your component

### Issue: Animations not working
**Solution**: Check that animation classes are imported from globals.css

### Issue: Favorites not persisting
**Solution**: Check localStorage is enabled in browser

## 📱 Responsive Design

### Breakpoints
```javascript
sm: 640px   // Small devices
md: 768px   // Medium devices
lg: 1024px  // Large devices
xl: 1280px  // Extra large devices
```

### Mobile-First Approach
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* Stacks on mobile, 2 cols on tablet, 3 cols on desktop */}
</div>
```

## ♿ Accessibility

### Required Attributes
```jsx
// Buttons
<button aria-label="Descriptive label">

// Sections
<section aria-labelledby="heading-id">

// Navigation
<nav aria-label="Breadcrumb">
```

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Focus indicators are visible
- Logical tab order is maintained

## 📊 Performance Tips

1. **Use Suspense** for async boundaries
2. **Memoize callbacks** with useCallback
3. **Extract static data** outside components
4. **Lazy load** heavy components
5. **Optimize images** with Next.js Image

## 🧪 Testing Examples

### Test Custom Hook
```javascript
import { renderHook, act } from '@testing-library/react-hooks';
import { useFavorites } from '@/hooks/useFavorites';

test('toggles favorite', () => {
  const { result } = renderHook(() => useFavorites('test-id'));
  
  act(() => {
    result.current.toggleFavorite();
  });
  
  expect(result.current.isFavorite).toBe(true);
});
```

### Test Component
```javascript
import { render, screen } from '@testing-library/react';
import Breadcrumb from '@/components/hotels/details/Breadcrumb';

test('renders breadcrumb', () => {
  render(<Breadcrumb hotelName="Test Hotel" city="Dubai" />);
  expect(screen.getByText('Test Hotel')).toBeInTheDocument();
});
```

## 📚 Related Documentation

- [Full Refactoring Guide](./HOTEL_DETAILS_REFACTORING.md)
- [Summary](./REFACTORING_SUMMARY.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Hooks Guide](https://react.dev/reference/react)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

**Last Updated**: November 2025
**Maintained by**: Development Team
**Questions?** Check the full documentation or ask the team!

















