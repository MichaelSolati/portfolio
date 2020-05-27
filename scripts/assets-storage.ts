import { Bucket } from '@google-cloud/storage';
import * as admin from 'firebase-admin';
import * as fs from 'fs';
import fetch from 'node-fetch';
import * as path from 'path';
import * as os from 'os';
const rimraf = require('rimraf');
const streamPipeline = require('util').promisify(require('stream').pipeline);
const webp = require('webp-converter');

import { environment } from '../src/environments/environment.prod';

let serviceAccount;
let bucket: Bucket;

if (fs.existsSync(path.join(process.cwd(), 'scripts', 'serviceAccountKey.json'))) {
  serviceAccount = require('./serviceAccountKey.json');
} else if (process.env.SERVICE_ACCOUNT_KEY) {
  serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_KEY);
}

if (serviceAccount) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: environment.firebase.storageBucket
    });

    bucket = admin.storage().bucket();
  } catch {}
}

const createFolder = async (folder: string): Promise<void> => {
  const folderPath = path.join('src', 'assets', folder);
  fs.mkdirSync(folderPath);
  return;
}

const createImage = async (url: string, folder: string, filename: string): Promise<{ src: string, output: string }> => {
  return fetch(url).then(async (response: any) => {
    if (!response.ok) throw new Error();
    // Save file locally
    const extension = response.headers.get('content-type').split('/').pop();
    const tempFileName = `temp-${filename}.${extension}`;
    const tempFilePath = path.join(os.tmpdir(), tempFileName);
    await streamPipeline(response.body, fs.createWriteStream(tempFilePath));

    // Variables for .webp file
    const webpFileName = `${filename}.webp`;
    const tempWebpFilePath = path.join(os.tmpdir(), webpFileName);

    return new Promise<{ src: string, output: string }>((resolve, reject) => {
      const webpConverter = (extension === 'gif') ? webp.gwebp : webp.cwebp;
      webpConverter(tempFilePath, tempWebpFilePath, `-q ${(extension === 'gif') ? '10' : '50'}`, async (s: any) => {
        if (s === '100' && bucket) {
          console.log('Saving to GCP Bucket.');
          const upload = await bucket.upload(tempWebpFilePath, { destination: `${folder}/${webpFileName}`, gzip: true, public: true });
          return resolve({
            src: tempFilePath,
            output: `https://storage.googleapis.com/${upload[1].bucket}/${folder}/${webpFileName}`
          });
        } else if (s === '100') {
          console.log('Saving to local storage.');
          fs.copyFileSync(tempWebpFilePath, path.join('src', 'assets', folder, webpFileName));
          resolve({ src: tempFilePath, output: `./assets/${folder}/${webpFileName}` });
        } else {
          reject();
        }
      });
    });
  });
};


const deleteFolder = async (folder: string): Promise<any> => {
  const folderPath = path.join('src', 'assets', folder);
  rimraf.sync(folderPath);
  if (bucket) {
    const [files] = await bucket.getFiles({ prefix: folder });
    const deleteFiles = files.map((file) => file.delete());
    return Promise.all(deleteFiles);
  }
  return;
}

export default {
  createFolder,
  createImage,
  deleteFolder
}
