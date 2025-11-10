import { defineConfig } from 'i18next-cli';

export default defineConfig({
  locales: [
    "en"
  ],
  extract: {
    input: "src/contents/*.{js,jsx,ts,tsx}",
    output: "public/locales/{{language}}.json"
  }
});
