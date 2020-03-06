module.exports = {
  presets: [],
  env: {
    test: {
      presets: [],
      plugins: [
        'transform-es2015-modules-commonjs',
        'babel-plugin-dynamic-import-node'
      ]
    }
  }
};
