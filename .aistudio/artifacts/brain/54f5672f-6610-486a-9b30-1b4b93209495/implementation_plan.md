# Implementation Plan - Fix Logo Thumbnail and Search Preview Appearance

## Problem
The logo displayed in search results and business profile thumbnails (as seen in the user's screenshot) appears letterboxed with green padding at the top and bottom because a wide horizontal banner image (`website_header_horizontal.png` / `tuhfat-al-ilm-header.png`) is being used in a square thumbnail container.

## Proposed Changes

### 1. Update Logo and OpenGraph / Search Preview Assets
- Ensure all meta tags (`og:image`, `twitter:image`, Schema.org logo) point to a clean, square, high-resolution logo asset (`/tuhfat-al-ilm-logo.png` or `/logo.png`) that fits square profile containers perfectly without letterboxing.
- Verify favicon, apple-touch-icon, and social preview cards reference properly centered square emblem graphics.

### 2. Verify Metadata & Structured Data
- Review `index.html` and `metadata.json` to ensure the organization logo points to the square version (`https://tuhfatalilm.online/tuhfat-al-ilm-logo.png`) rather than horizontal headers.

## Verification Plan
- Build project (`npm run build`) and verify asset outputs.
- Verify structured data and meta tag references in `index.html`.
