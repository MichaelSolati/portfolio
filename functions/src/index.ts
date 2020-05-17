import * as functions from 'firebase-functions';
import { Express } from 'express';

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const ssr = functions.https.onRequest((request, response) => {
  response.set('Cache-Control', 'public, max-age=300, s-maxage=600');
  const app: Express = require(`${process.cwd()}/dist/portfolio/server/main`).app();
  app(request, response);
});
