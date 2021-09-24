import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import { uglify } from 'rollup-plugin-uglify'
import bannerPlugin from 'rollup-plugin-banner'
import banner from './banner'

const input = 'src/light-currency.js'
const pathPrefix = 'dist/standard/light-currency.'
export default [
	{
		input,
		output: [
			{
				file: pathPrefix + 'cjs.js',
				format: 'cjs',
			},
			{
				file: pathPrefix + 'amd.js',
				format: 'amd',
			},
			{
				file: pathPrefix + 'iife.js',
				format: 'iife',
				name: 'Currency',
			},
			{
				file: pathPrefix + 'es.js',
				format: 'esm',
			},
			{
				file: pathPrefix + 'umd.js',
				format: 'umd',
				name: 'Currency',
			},
		],
		plugins: [
			babel({
				exclude: 'node_modules/**',
			}),
			resolve(),
			commonjs(),
			bannerPlugin(banner),
		],
	},
	{
		input,
		output: [
			{
				file: pathPrefix + 'min.js',
				format: 'umd',
				name: 'Currency',
			},
		],
		plugins: [
			babel({
				exclude: 'node_modules/**',
			}),
			resolve(),
			commonjs(),
			uglify({
				compress: {
					pure_getters: true,
				},
			}),
			bannerPlugin(banner),
		],
	},
]
