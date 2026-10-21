// Tailwind v4 runs only on src/app/tailwind.css (the admin, for now). The
// plugin bails out on CSS without Tailwind at-rules, so globals.css (v2) is
// emitted as before.
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
