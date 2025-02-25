/** @type {import('prettier').Options} */
module.exports = {
  singleQuote: true,
  semi: false,
  jsxSingleQuote: true,
  plugins: ['prettier-plugin-tailwindcss'],
  tailwindStylesheet: './src/styles/tailwind.css',
}
