export default {
  build: {
    extendViteConf(viteConf) {
      if (viteConf.css !== Object(viteConf.css)) {
        viteConf.css = {};
      }
      if (viteConf.css.postcss !== Object(viteConf.css.postcss)) {
        viteConf.css.postcss = {};
      }
      if (Array.isArray(viteConf.css.postcss.plugins) === false) {
        viteConf.css.postcss.plugins = [];
      }
      viteConf.css.postcss.plugins.unshift({
        postcssPlugin: 'internal:charset-removal',
        AtRule: {
          charset: (atRule) => {
            if (atRule.name === 'charset') {
              atRule.remove();
            }
          },
        },
      });
    },
  }
}

