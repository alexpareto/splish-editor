module.exports = {
  webpack(config) {
    config.node = {
      __dirname: false,
      __filename: false,
    };

    config.target = 'electron-renderer';

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
