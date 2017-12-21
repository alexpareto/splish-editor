
module.exports = {
  webpack(config) {

    config.node = {
      __dirname: false,
      __filename: false
    };

    config.target = 'electron-renderer'

    return config
  },
  exportPathMap() {
    return {
      '/start': { page: '/start' }
    }
  }
}
