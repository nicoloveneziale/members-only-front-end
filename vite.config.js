import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/members-only-front-end/",
  test: {
    environment: "jsdom",
  },
});
