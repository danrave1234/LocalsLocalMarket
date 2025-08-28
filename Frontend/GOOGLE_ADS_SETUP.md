# Google Ads Setup Guide for LocalsLocalMarket

This guide will help you set up Google Ads (AdWords), Google Analytics, and Google AdSense on your LocalsLocalMarket website.

## Prerequisites

1. A Google account
2. A domain name for your website
3. Access to your website's HTML files

## Step 1: Set Up Google Analytics

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click "Start measuring"
3. Create a new property for your website
4. Get your Measurement ID (starts with "G-")
5. Replace `YOUR_GA_ID` in `index.html` with your actual Measurement ID

## Step 2: Set Up Google Ads (AdWords)

1. Go to [Google Ads](https://ads.google.com/)
2. Create a new account
3. Get your Google Ads account ID (starts with "AW-")
4. Replace `YOUR_GOOGLE_ADS_ID` in `index.html` with your actual account ID

## Step 3: Set Up Google AdSense

1. Go to [Google AdSense](https://www.google.com/adsense/)
2. Sign up for an AdSense account
3. Wait for approval (can take 1-2 weeks)
4. Get your publisher ID (starts with "ca-pub-")
5. Replace `YOUR_ADSENSE_ID` in `index.html` with your actual publisher ID

## Step 4: Create Ad Units

### In Google AdSense:
1. Go to "Ads" → "By ad unit"
2. Click "Create new ad unit"
3. Choose the ad format (Display, In-article, etc.)
4. Get the ad unit code
5. Replace the placeholder ad slots in the code:

### Ad Slot Placeholders to Replace:

#### In `index.html`:
- `AW-YOUR_GOOGLE_ADS_ID` → Your Google Ads account ID
- `G-YOUR_GA_ID` → Your Google Analytics Measurement ID
- `ca-pub-YOUR_ADSENSE_ID` → Your AdSense publisher ID

#### In `GoogleAds.jsx`:
- `YOUR_HEADER_AD_SLOT` → Header ad unit ID
- `YOUR_SIDEBAR_AD_SLOT` → Sidebar ad unit ID
- `YOUR_FOOTER_AD_SLOT` → Footer ad unit ID
- `YOUR_IN_CONTENT_AD_SLOT` → In-content ad unit ID
- `YOUR_BANNER_AD_SLOT` → Banner ad unit ID
- `YOUR_RESPONSIVE_AD_SLOT` → Responsive ad unit ID

## Step 5: Configure Ad Placements

The site is already set up with strategic ad placements:

### Current Ad Locations:
1. **Top Banner** - Above the main content on landing page
2. **In-Content** - After the shops list header
3. **Header** - In the navigation area (ready to implement)
4. **Footer** - At the bottom of pages (ready to implement)
5. **Sidebar** - In sidebar areas (ready to implement)

### Adding More Ads:

To add ads to other pages, import the ad components:

```jsx
import { InContentAd, ResponsiveAd, BannerAd } from '../components/GoogleAds.jsx'
```

Then use them in your components:

```jsx
<InContentAd />
<ResponsiveAd />
<BannerAd />
```

## Step 6: Test Your Setup

1. Deploy your website
2. Check that ads are displaying correctly
3. Verify tracking is working in Google Analytics
4. Monitor your AdSense dashboard for impressions

## Step 7: Optimize Performance

### Best Practices:
1. **Don't overload with ads** - Keep user experience in mind
2. **Test on mobile** - Ensure ads work well on all devices
3. **Monitor page speed** - Ads can slow down your site
4. **Follow AdSense policies** - Avoid policy violations

### Recommended Ad Density:
- Maximum 3 ads per page
- At least 200 words between ads
- Don't place ads too close to navigation elements

## Step 8: Track Performance

### Key Metrics to Monitor:
- **CTR (Click-Through Rate)** - Should be above 1%
- **RPM (Revenue Per Mille)** - Revenue per 1000 impressions
- **Page Views** - Track in Google Analytics
- **Bounce Rate** - Ensure ads don't hurt user engagement

## Troubleshooting

### Common Issues:

1. **Ads not showing**: Check if you're in development mode (ads are disabled)
2. **Wrong ad slots**: Verify all placeholder IDs are replaced
3. **Policy violations**: Review AdSense policies
4. **Slow loading**: Optimize ad placement and reduce ad count

### Development vs Production:
- Ads are automatically disabled in development mode
- They show placeholder boxes instead
- This prevents accidental clicks during development

## Additional Resources

- [Google AdSense Help Center](https://support.google.com/adsense/)
- [Google Analytics Help](https://support.google.com/analytics/)
- [Google Ads Help](https://support.google.com/google-ads/)

## Security Notes

- Never share your AdSense publisher ID publicly
- Keep your Google account secure with 2FA
- Regularly monitor for suspicious activity

## Revenue Optimization Tips

1. **A/B test ad placements** - Find what works best
2. **Use responsive ads** - Better mobile performance
3. **Optimize for user experience** - Happy users click more
4. **Focus on quality content** - Better content = more traffic = more revenue

---

**Note**: This setup is for educational purposes. Make sure to comply with all Google policies and local advertising regulations.
