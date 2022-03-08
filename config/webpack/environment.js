const { environment } = require('@rails/webpacker');
const { VueLoaderPlugin } = require('vue-loader');
const resolve = require('./resolve');
const vue = require('./loaders/vue');
const MonacoEditorPlugin = require('monaco-editor-webpack-plugin');

environment.plugins.prepend('VueLoaderPlugin', new VueLoaderPlugin());
environment.loaders.prepend('vue', vue);
environment.loaders.append('audio', {
  test: /\.(mp3)(\?.*)?$/,
  loader: 'url-loader',
  query: {
    limit: 10000,
    name: 'audio/[name].[ext]',
  },
});

environment.plugins.prepend(
  'MonacoEditorPlugin',
  new MonacoEditorPlugin({
    languages: ['javascript', 'typescript'],
    features: ['!codelens', '!colorPicker'],
  })
);

environment.config.merge({ resolve });
environment.config.set('output.filename', chunkData => {
  return chunkData.chunk.name === 'sdk'
    ? 'js/[name].js'
    : 'js/[name]-[hash].js';
});

module.exports = environment;
