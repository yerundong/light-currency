module.exports = {
  presets: [
    [
      "@babel/preset-env",
      // ie need
      // {
      // 	modules: false,
      // 	useBuiltIns: 'usage',
      // 	corejs: 3,
      // 	exclude: [
      // 		// /^(?!es.object.assign)(?!es.array.includes)(?!es.number.is-nan)/g,
      // 		'es.regexp.exec',
      // 		'es.string.replace',
      // 		'es.string.split',
      // 		'es.array.splice',
      // 		'es.array.join',
      // 		'es.array.concat',
      // 		'es.array.slice',
      // 		'es.object.to-string',
      // 		'es.number.constructor',
      // 		'es.object.is',
      // 		'es.regexp.to-string',
      // 		'es.regexp.constructor',
      // 	],
      // },
    ],
  ],
  plugins: [],
};
