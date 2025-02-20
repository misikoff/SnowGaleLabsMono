/** @type {import('tailwindcss').Config} */

import nativeWindPreset from 'nativewind/preset'

module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [nativeWindPreset],
  theme: {
    extend: {},
  },
  plugins: [],
}
