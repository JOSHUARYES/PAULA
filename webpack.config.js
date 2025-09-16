const path = require('path');

module.exports = {
  mode: 'development', // cambia a 'production' cuando hagas el build final (development,production)
  entry: './src/PAULA/presentacion/index.jsx', // archivo de entrada
  output: {
    path: path.resolve(__dirname, 'dist'), // carpeta de salida
    filename: 'bundle.js'  // bundle que cargará el HTML
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,      // archivos .js o .jsx
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'] // presets para JS moderno y React jsx
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'] // para importar sin extensiones
  },
  devtool: 'source-map' // para facilitar la depuración
};
