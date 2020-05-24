import fetch from 'node-fetch';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
const streamPipeline = require('util').promisify(require('stream').pipeline);
const webp = require('webp-converter');

export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const cleanText = (text: string = ''): string => {
  const regexRemoveMultipleSpaces = / +/g
  const regexRemoveLineBreaks = /(\r\n\t|\n|\r\t)/gm

  return (text || '')
    .replace(regexRemoveLineBreaks, '')
    .replace(regexRemoveMultipleSpaces, ' ')
    .replace('...', '')
    .replace('See more', '')
    .replace('See less', '')
    .trim();
};

export const writeDataTs = (folder: string, json: any): void => {
  const appFolder = path.join('src', 'app', folder, 'data.ts');
  const file = `const data = ${JSON.stringify(json, null, '\t')};\nexport default data;`;
  fs.writeFileSync(appFolder, file);
};

export const saveImagetoWebP = async (src: string, saveTo: string): Promise<{input: string, output: string}> => {
  const toWebP = (input: string, output: string, extension?: string): Promise<{input: string, output: string}> => {
    return new Promise((resolve, reject) => {
      if (extension && extension === 'gif') {
        webp.gwebp(input, output, '-q 50', (s) => (s === '100') ? resolve({ input, output }) : reject())
      } else {
        webp.cwebp(input, output, '-q 50', (s) => (s === '100') ? resolve({ input, output }) : reject());
      }
    });
  };
  return fetch(src).then(async (response: any) => {
    if (!response.ok) throw new Error();
    const extension = response.headers.get('content-type').split('/').pop();
    const fileName = `image.${extension}`;
    const tempProfilePath = path.join(os.tmpdir(), fileName);
    await streamPipeline(response.body, fs.createWriteStream(tempProfilePath));
    return toWebP(tempProfilePath, saveTo, extension);
  });
};
