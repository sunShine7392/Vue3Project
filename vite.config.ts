import { defineConfig, loadEnv, type ConfigEnv } from 'vite';
import { resolve } from 'path';

import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

import viteMock from 'vite-easy-mock';

// https://vitejs.dev/config/
export default defineConfig((mode: ConfigEnv) => {
  // vite脚手架中通过loadEnv函数加载env
  // 项目代码是通过import.meta.env加载env
  const env = loadEnv(mode.mode, process.cwd());

  return {
    plugins: [
      vue(),
      vueJsx(),
      // 拦截/mock开头的请求，去本地mock文件夹中找对应的资源，找到响应，找不到404
      viteMock({
        dir: '',
        pattern: '/mock',
      }),
    ],
    resolve: {
      // 配置路径别名
      alias: {
        '@': resolve(__dirname, 'src'),
      },
      // 配置文件扩展名
      extensions: ['.ts', '.vue', '.js', '.jsx', '.tsx'], // 导入时想要省略的扩展名列表。
    },
    css: {
      preprocessorOptions: {
        scss: {
          // 引入 var.scss 这样就可以在全局中使用 var.scss中预定义的变量了
          // 给导入的路径最后加上 ;
          additionalData: '@import "./src/styles/variables.scss";',
        },
      },
      postcss: {
        plugins: [
          {
            postcssPlugin: 'internal:charset-removal',
            AtRule: {
              charset: (atRule) => {
                if (atRule.name === 'charset') {
                  atRule.remove();
                }
              },
            },
          },
        ],
      },
    },
    server: {
      port: +env.VITE_PORT,
      open: env.VITE_OPEN === 'true',
      // 配置代理服务器
      proxy: {
        '/app-dev': {
          target: 'http://sph-h5-api.atguigu.cn',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/app-dev/, ''),
        },
      },
    },
  };
});
