# Quick Start Guide - PDF Ticket System

## ✅ System is Ready!

Your PDF ticket generation system has been **completely rebuilt** and is ready to use!

## 🚀 Quick Test (3 Steps)

### Step 1: Start Your Dev Server

```bash
npm run dev
```

### Step 2: Test the API

Open a new terminal and run:

**Windows PowerShell:**

```powershell
curl -X POST http://localhost:3000/api/tickets/pdf `
  -H "Content-Type: application/json" `
  -d (Get-Content test-booking-data.json -Raw) `
  --output ticket.pdf
```

**Linux/Mac:**

```bash
curl -X POST http://localhost:3000/api/tickets/pdf \
  -H "Content-Type: application/json" \
  -d @test-booking-data.json \
  --output ticket.pdf
```

### Step 3: View the PDF

Open `ticket.pdf` in your default PDF viewer!

## 📱 Test from Frontend

1. Go to: `http://localhost:3000/flights/booking-success`
2. Click the **Download Ticket** button
3. The PDF will be generated and downloaded!

## 📂 What Changed?

### New/Updated Files:

1. ✅ `src/config/pdf.config.js` - Configuration (colors, fonts, company)
2. ✅ `src/utils/pdfHelpers.js` - Helper functions (formatting)
3. ✅ `src/utils/pdfRenderer.js` - Rendering functions (modular)
4. ✅ `src/app/api/tickets/pdf/route.js` - API endpoint (main)
5. ✅ `docs/PDF_TICKET_LAYOUT.md` - Full documentation
6. ✅ `test-booking-data.json` - Sample test data
7. ✅ `PDF-REBUILD-SUMMARY.md` - Detailed summary
8. ✅ `QUICK-START-PDF.md` - This file!

## 🎨 Customize for Your Brand

### 1. Change Company Info

Edit `src/config/pdf.config.js` (lines 50-56):

```javascript
export const COMPANY_INFO = {
  name: "YOUR COMPANY NAME",
  address: "YOUR ADDRESS",
  phone: "YOUR PHONE",
  email: "YOUR EMAIL",
  logoPath: "public/light-logo.png",
};
```

### 2. Change Brand Colors

Edit `src/config/pdf.config.js` (lines 14-17):

```javascript
export const COLORS = {
  PRIMARY: rgb(0.0, 0.6, 0.3), // Change to your brand color
  PRIMARY_LIGHT: rgb(0.85, 0.95, 0.9), // Light version
  // ...
};
```

### 3. Add Your Logo

1. Place your logo at: `public/light-logo.png`
2. Supported formats: PNG or JPG
3. Recommended size: 200x80 pixels

## 📖 Complete Documentation

For detailed information, see:

- **`docs/PDF_TICKET_LAYOUT.md`** - Complete API docs
- **`PDF-REBUILD-SUMMARY.md`** - What was done

## 🎯 What's Included in the PDF?

1. **Header** - Company logo and information
2. **Booking Info** - Reference number, date, status badge
3. **Flight Details** - ONWARD and RETURN flights
   - Route, date, duration
   - Airline name and PNR
   - Baggage allowances
   - Flight table with terminals and times
4. **Passengers** - List of all passengers with ticket numbers
5. **Fare Summary** - Base fare, taxes, total amount
6. **Important Notes** - Yellow highlighted boxes with instructions
7. **Footer** - Contact information

## 🔧 API Details

**Endpoint:** `POST /api/tickets/pdf`

**Request Body:**

```json
{
  "bookingData": {
    "bookingId": "FM123456",
    "bookingDate": "2025-10-03",
    "status": "CONFIRMED",
    "flights": [...],
    "passengers": [...],
    "pricing": {...}
  }
}
```

**Response:** Binary PDF file

**Error Response:**

```json
{
  "success": false,
  "error": "Error message"
}
```

## ✨ Features

✅ Clean, professional design  
✅ Multiple flights (ONWARD/RETURN)  
✅ Multiple passengers  
✅ Multi-currency support  
✅ Status badges (CONFIRMED/PENDING/CANCELLED)  
✅ Company branding  
✅ Automatic data normalization  
✅ Graceful error handling  
✅ No linting errors

## 🐛 Common Issues

### Issue: Logo not showing

**Fix:** Make sure `public/light-logo.png` exists (PNG or JPG format)

### Issue: PDF generation fails

**Fix:** Check that `bookingId` is provided in the request

### Issue: Wrong currency

**Fix:** Pass `currency: "SAR"` (or your currency) in the pricing object

### Issue: Date format errors

**Fix:** Use ISO 8601 format: `"2025-10-15T14:30:00Z"`

## 📞 Need Help?

1. Check console logs for detailed errors
2. Review `docs/PDF_TICKET_LAYOUT.md`
3. Test with the provided `test-booking-data.json`
4. Verify your data structure matches the examples

## 🎉 That's It!

Your PDF system is ready! Try generating a ticket now.

---

**Build Status:** ✅ Compiled Successfully  
**Linter Status:** ✅ No Errors  
**Ready to Deploy:** ✅ Yes

Happy coding! 🚀

