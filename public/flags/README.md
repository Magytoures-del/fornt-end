# Flag Images

This directory contains flag images for the PhoneNumberInput component.

## File Naming Convention

Flag images should be named using the ISO 3166-1 alpha-2 country code in lowercase, followed by `.svg` extension.

Examples:

- `sa.svg` - Saudi Arabia
- `ae.svg` - United Arab Emirates
- `us.svg` - United States
- `gb.svg` - United Kingdom

## Image Requirements

- **Format**: SVG (preferred) or PNG
- **Size**: Recommended 24x16px or 32x21px (3:2 aspect ratio)
- **Style**: Clean, simple flag designs work best
- **Colors**: Use official flag colors

## Adding New Flags

1. Create the flag image file with the correct country code
2. Place it in this directory (`public/flags/`)
3. The PhoneNumberInput component will automatically use it
4. If the image fails to load, a fallback emoji flag will be displayed

## Sources for Flag Images

- [Flagpedia](https://flagpedia.net/)
- [World Flag Database](https://www.worldflagdatabase.com/)
- [SVG Flags](https://github.com/lipis/flag-icons)

## Current Flags

The following flags are currently available:

- Saudi Arabia (sa.svg)
- UAE (ae.svg)
- United States (us.svg)

More flags can be added as needed.
