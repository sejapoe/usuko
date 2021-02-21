module.exports = {
  devServer: {
    progress: false,
    proxy: {
      '^/api': {
        target: 'http://localhost:3080',
        changeOrigin: true,
      },
    },
  },
};
