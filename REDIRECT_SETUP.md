# HTTP Redirect Setup for www/non-www Canonicalization

## Problem

Your website is accessible via both `www.yourdomain.com` and `yourdomain.com`, which can cause:

- Duplicate content issues
- SEO problems
- Confusion for search engines
- Split link equity

## Solution Implemented

### 1. Middleware (middleware.js)

- Created a middleware file that handles redirects at the edge
- Automatically redirects www to non-www (or vice versa)
- Uses 301 permanent redirects for SEO benefits
- Excludes API routes and static files from redirects

### 2. Next.js Configuration (next.config.mjs)

- Added redirect rules in the Next.js config
- Enhanced security headers
- Added additional protection headers

## Configuration Required

### Update Domain Names

You need to replace the placeholder domains in both files:

**In `middleware.js`:**

```javascript
const canonicalDomain = "your-actual-domain.com"; // Replace with your real domain
```

**In `next.config.mjs`:**

```javascript
value: 'www.your-actual-domain.com', // Replace with your actual www domain
destination: 'https://your-actual-domain.com/:path*', // Replace with your actual non-www domain
```

### Choose Your Preferred Domain

Decide whether you want:

- **Non-www version** (e.g., `yourdomain.com`) - Currently configured
- **www version** (e.g., `www.yourdomain.com`)

If you prefer www, uncomment the www section in middleware.js and comment the non-www section.

## Testing Your Redirects

After deployment, test these URLs:

- `https://www.yourdomain.com` → Should redirect to `https://yourdomain.com`
- `https://www.yourdomain.com/about` → Should redirect to `https://yourdomain.com/about`
- `https://yourdomain.com` → Should remain as is (no redirect)

## Additional Recommendations

### 1. Update Google Search Console

- Add both www and non-www versions of your domain
- Set your preferred domain as the canonical version
- Monitor for any crawl errors

### 2. Update Analytics

- Ensure your analytics tools are configured for the canonical domain
- Update any hardcoded URLs in your application

### 3. Update External Links

- Update any external links pointing to your site
- Consider using relative URLs in your application

### 4. Sitemap and Robots.txt

- Ensure your sitemap uses the canonical domain
- Update robots.txt if needed

## Security Headers Added

- `X-Frame-Options`: Prevents clickjacking
- `X-Content-Type-Options`: Prevents MIME type sniffing
- `Referrer-Policy`: Controls referrer information
- `X-XSS-Protection`: Additional XSS protection

## Deployment

1. Update the domain names in both files
2. Deploy your application
3. Test the redirects
4. Monitor your analytics and search console for any issues

## Verification

After deployment, use tools like:

- [Redirect Checker](https://redirect-checker.org/)
- [HTTP Status Checker](https://httpstatus.io/)
- Browser developer tools to verify redirects work correctly
