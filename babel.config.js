module.exports = {
    presets: [
      ['@babel/preset-env', {
        targets: { node: 'current' },
        // Важно: Трансформируем модули в CommonJS
        modules: 'commonjs',
      }],
    ],
    plugins: [
      // Этот плагин трансформирует синтаксис import/export в CommonJS
      '@babel/plugin-transform-modules-commonjs',
    ],
  };
  