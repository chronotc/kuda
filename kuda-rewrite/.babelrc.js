module.exports = {
  presets: [
    ['@babel/preset-env', {
      useBuiltIns: 'usage',
      targets: {
        node: '6.10.3'
      }
    }]
  ],
  plugins: [
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-proposal-class-properties'
  ]
}