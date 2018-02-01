module.exports = {
  webpack(config) {
    config.resolve.alias = {
      './lib-cov/fluent-ffmpeg': './lib/fluent-ffmpeg',
    };

    config.node = {
      __dirname: false,
      __filename: false,
    };

    config.target = 'electron-renderer';
    config.plugins = config.plugins.filter(plugin => {
      if (plugin.constructor.name === 'UglifyJsPlugin') {
        return false;
      } else {
        return true;
      }
    });

    return config;
  },
  exportPathMap() {
    return {
      '/mainMenu': { page: '/mainMenu' },
      '/cinemagraph': { page: '/cinemagraph' },
      '/movingStill': { page: '/movingStill' },
    };
  },
};
