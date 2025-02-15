/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // 确保扫描 React 组件文件
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
