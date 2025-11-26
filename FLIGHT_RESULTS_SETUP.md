# Flight Results Page Setup

## Overview

A new flight results page has been created that displays search results for flights based on search parameters. The page is located at `/flights/results/[origin]/[destination]/[date]/[direct]` and accepts query parameters for passengers and cabin class.

## URL Structure

The results page follows this URL pattern:

```
/flights/results/{origin}/{destination}/{date}/{direct}?adults={adults}&children={children}&infants={infants}&cabinClass={cabinClass}
```

### Example URL

```
/flights/results/CAI/JED/2025-09-30/true/?adults=1&children=0&infants=0&cabinClass=E
```

### URL Parameters

#### Path Parameters

- `origin`: Origin airport code (e.g., CAI for Cairo)
- `destination`: Destination airport code (e.g., JED for Jeddah)
- `date`: Travel date in YYYY-MM-DD format
- `direct`: Whether to show direct flights only (true/false)

#### Query Parameters

- `adults`: Number of adult passengers (default: 1)
- `children`: Number of child passengers (default: 0)
- `infants`: Number of infant passengers (default: 0)
- `cabinClass`: Cabin class (E=Economy, B=Business, F=First, default: E)

## Features

### 1. Dynamic Route

- Automatically captures URL parameters
- Generates appropriate metadata for SEO
- Handles missing parameters gracefully

### 2. Flight Results Display

- Shows airline information with logos
- Displays departure/arrival times and duration
- Shows pricing information
- Includes flight details (stops, cabin class)
- Responsive design for mobile and desktop

### 3. Search Filters

- Price range filtering
- Number of stops filtering
- Airline selection
- Departure time filtering
- Clear all filters option

### 4. Interactive Elements

- Click to select flights
- Expandable flight details
- Booking buttons for each flight
- Loading states and error handling

## Components

### Main Page

- `src/app/flights/results/[origin]/[destination]/[date]/[direct]/page.js`
- Handles URL parameters and API calls
- Manages loading and error states

### Flight Results Component

- `src/components/flights/FlightResults.js`
- Displays individual flight cards
- Handles flight selection and booking

### Search Filters Component

- `src/components/search/SearchFilters.js`
- Provides filtering options
- Manages filter state

### API Route

- `src/app/api/flights/search/route.js`
- Handles flight search requests
- Returns mock data (replace with real API)

## Usage Examples

### Basic Search

```
/flights/results/CAI/JED/2025-09-30/true/
```

### With Passenger Details

```
/flights/results/CAI/JED/2025-09-30/true/?adults=2&children=1&infants=0&cabinClass=B
```

### Business Class Search

```
/flights/results/CAI/JED/2025-09-30/false/?adults=1&cabinClass=B
```

## Implementation Notes

### Current State

- Uses mock data for demonstration
- Includes basic error handling
- Responsive design with Tailwind CSS
- SEO-friendly with dynamic metadata

### Future Enhancements

- Integrate with real flight search API
- Add sorting options (price, duration, departure time)
- Implement real-time pricing updates
- Add flight comparison features
- Include booking flow integration

### Dependencies

- Next.js 13+ with App Router
- React hooks for state management
- Tailwind CSS for styling
- Framer Motion for animations (Spinner component)

## Testing

To test the page:

1. Navigate to the URL with valid parameters
2. Verify that flight results are displayed
3. Test filter functionality
4. Check responsive design on different screen sizes
5. Verify error handling with invalid parameters

## Customization

The page can be customized by:

- Modifying the mock data in the API route
- Adjusting the filter options
- Changing the styling and layout
- Adding additional search parameters
- Implementing real API integration
