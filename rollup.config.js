import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import * as fs from 'fs';
import cleanup from 'rollup-plugin-cleanup';
import {terser} from 'rollup-plugin-terser';
import * as path from 'path';

const isProd = process.env.NODE_ENV === 'prod';
const src = 'src/scripts';
const dist = 'dist/scripts';
const plugins = [
  typescript({sourceMap: !isProd, inlineSources: !isProd}),
  resolve(),
];
const scriptsPath = path.join(__dirname, 'src/scripts');
const scriptsFiles = fs.readdirSync(scriptsPath);

if (isProd) {
  plugins.push(terser());
  plugins.push(cleanup({comments: 'none'}));
}

export default scriptsFiles.map(file => {
  return {
    input: path.join(src, file),
    output: {
      file: path.join(dist, file.replace(/\.ts$/, '.js')),
      format: 'iife',
    },
    external: ['@material', 'firebase'],
    plugins,
  };
});
