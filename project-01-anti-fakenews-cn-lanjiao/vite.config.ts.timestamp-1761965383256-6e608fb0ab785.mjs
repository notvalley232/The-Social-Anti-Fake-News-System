// vite.config.ts
import { defineConfig } from "file:///C:/Users/Administrator/Desktop/project-01/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/Users/Administrator/Desktop/project-01/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import path from "path";
import Inspector from "file:///C:/Users/Administrator/Desktop/project-01/node_modules/unplugin-vue-dev-locator/dist/vite.mjs";
import traeBadgePlugin from "file:///C:/Users/Administrator/Desktop/project-01/node_modules/vite-plugin-trae-solo-badge/dist/vite-plugin.esm.js";
var __vite_injected_original_dirname = "C:\\Users\\Administrator\\Desktop\\project-01";
var vite_config_default = defineConfig({
  build: {
    sourcemap: "hidden"
  },
  plugins: [
    vue(),
    Inspector(),
    traeBadgePlugin({
      variant: "dark",
      position: "bottom-right",
      prodOnly: true,
      clickable: true,
      clickUrl: "https://www.trae.ai/solo?showJoin=1",
      autoTheme: true,
      autoThemeTarget: "#app"
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
      // ✅ 定义 @ = src
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxBZG1pbmlzdHJhdG9yXFxcXERlc2t0b3BcXFxccHJvamVjdC0wMVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcQWRtaW5pc3RyYXRvclxcXFxEZXNrdG9wXFxcXHByb2plY3QtMDFcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL0FkbWluaXN0cmF0b3IvRGVza3RvcC9wcm9qZWN0LTAxL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXHJcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXHJcbmltcG9ydCBJbnNwZWN0b3IgZnJvbSAndW5wbHVnaW4tdnVlLWRldi1sb2NhdG9yL3ZpdGUnXHJcbmltcG9ydCB0cmFlQmFkZ2VQbHVnaW4gZnJvbSAndml0ZS1wbHVnaW4tdHJhZS1zb2xvLWJhZGdlJ1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgYnVpbGQ6IHtcclxuICAgIHNvdXJjZW1hcDogJ2hpZGRlbicsXHJcbiAgfSxcclxuICBwbHVnaW5zOiBbXHJcbiAgICB2dWUoKSxcclxuICAgIEluc3BlY3RvcigpLFxyXG4gICAgdHJhZUJhZGdlUGx1Z2luKHtcclxuICAgICAgdmFyaWFudDogJ2RhcmsnLFxyXG4gICAgICBwb3NpdGlvbjogJ2JvdHRvbS1yaWdodCcsXHJcbiAgICAgIHByb2RPbmx5OiB0cnVlLFxyXG4gICAgICBjbGlja2FibGU6IHRydWUsXHJcbiAgICAgIGNsaWNrVXJsOiAnaHR0cHM6Ly93d3cudHJhZS5haS9zb2xvP3Nob3dKb2luPTEnLFxyXG4gICAgICBhdXRvVGhlbWU6IHRydWUsXHJcbiAgICAgIGF1dG9UaGVtZVRhcmdldDogJyNhcHAnLFxyXG4gICAgfSksXHJcbiAgXSxcclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczoge1xyXG4gICAgICAnQCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYycpLCAvLyBcdTI3MDUgXHU1QjlBXHU0RTQ5IEAgPSBzcmNcclxuICAgIH0sXHJcbiAgfSxcclxufSlcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF1VCxTQUFTLG9CQUFvQjtBQUNwVixPQUFPLFNBQVM7QUFDaEIsT0FBTyxVQUFVO0FBQ2pCLE9BQU8sZUFBZTtBQUN0QixPQUFPLHFCQUFxQjtBQUo1QixJQUFNLG1DQUFtQztBQU96QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixPQUFPO0FBQUEsSUFDTCxXQUFXO0FBQUEsRUFDYjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsSUFBSTtBQUFBLElBQ0osVUFBVTtBQUFBLElBQ1YsZ0JBQWdCO0FBQUEsTUFDZCxTQUFTO0FBQUEsTUFDVCxVQUFVO0FBQUEsTUFDVixVQUFVO0FBQUEsTUFDVixXQUFXO0FBQUEsTUFDWCxVQUFVO0FBQUEsTUFDVixXQUFXO0FBQUEsTUFDWCxpQkFBaUI7QUFBQSxJQUNuQixDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBO0FBQUEsSUFDdEM7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
