const path = require('path');

module.exports = {
  entry: './App/index.ts',
  devtool: 'inline-source-map',
  mode: 'production',
  target: 'node',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@Requests': path.resolve(__dirname, 'App/Core/Routing/'),
      '@Decorators': path.resolve(__dirname, 'App/Core/Decorators/'),
      '@Services/': path.resolve(__dirname, 'App/Services/'),
      '@Models': path.resolve(__dirname, 'App/Models/'),
      '@Interfaces': path.resolve(__dirname, 'App/Interfaces')
    }
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
  },
};