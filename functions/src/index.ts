import * as functions from 'firebase-functions';
import { readFileSync } from 'fs';

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const ssr = functions.https.onRequest((request, response) => {
  response.set('Cache-Control', 'public, max-age=3600, s-maxage=43200');
  const app = require(`${process.cwd()}/dist/portfolio/server/main`).app();

  const _render = response.render;
  //@ts-ignore
  response.render = function (view: string, options: object): void {
    _render.bind(this)(view, options, (err: Error, html: string) => {
      if (err) {
        console.error(err);
        response.send(readFileSync('./portfolio/browser/index.html', 'utf8'));
      } else {
        response.send(html);
      }
    });
  };

  app(request, response);
});
