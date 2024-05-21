---
title: "PWAs with Angular: Being Reliable"
description: Let's take a look at how we can build a PWA with Angular!
pubDate: June 12 2017
hero: https://thepracticaldev.s3.amazonaws.com/i/85rsuaq2bm70t0sflf5w.png
---

If you've been in the world of web development during the past two years you've probably heard the term Progressive Web Apps (PWAs for short). PWAs are essentially web applications that provide a near-native experience on mobile devices. According to [Google](https://developers.google.com/web/progressive-web-apps/) they must be:

- **Reliable** - Load instantly and never show the downasaur, even in uncertain network conditions.
- **Fast** - Respond quickly to user interactions with silky smooth animations and no janky scrolling.
- **Engaging** - Feel like a natural app on the device, with an immersive user experience.

So how can we make sure our Angular applications follow these tenets and provide the best user experiences?

![Pages loading offline? Now that's reliable!](https://cdn-images-1.medium.com/max/800/1*O9qLQnmW8mmasCJzS-66OA.gif)

---

Well let's take a simple app I've already written and turn it into a PWA.

```bash
git clone --branch v0.0 https://github.com/MichaelSolati/ng-popular-movies-pwa.git
cd ng-popular-movies-pwa
npm install
```

*This app depends on [The MovieDB](https://www.themoviedb.org/)'s APIs. Get an API key ([check this out](https://www.themoviedb.org/faq/api?language=en)) and put it as the moviedb environment variable in your* `src/environments/environment.ts` *and* `src/environments/environment.prod.ts`*.*

Now that we have everything set up, lets run our application `npm run start:pwa`, open up Chrome and go to `localhost:8080` and see what it does.

![Built app running](https://cdn-images-1.medium.com/max/800/1*Q2pWrQrHdqAOjCBLV_2edg.png)

Well it runs, and if you click on a movie we can get more details about it. AWESOME! But what happens when we're offline?

![Built app offline](https://cdn-images-1.medium.com/max/800/1*Xeh-z7rWjlT_EjsfL6L2pg.gif)

Hmm… that’s not that good. If there was a test for PWAs that would definitely fail it…

Wait a sec! There is a test for PWAs! Google provides an extension for Chrome called [Lighthouse](https://chrome.google.com/webstore/detail/lighthouse/blipmdconlkpinefehnmjammfjpmpbjk?hl=en) (install it!) that will run a barrage of tests against our application and will generate a report on how well the app did. And, as I expected, this app failed hard.

![Not that good of a PWA](https://cdn-images-1.medium.com/max/800/1*Hu0GAISU5Dg5uswkb32-Mg.png)

---

We can do better than this, so lets make this app more reliable!

The first thing we can do to address a lot of these issues is to use a Service Worker. A Service Worker enables our PWA to load instantly, regardless of the network state. It sits as a proxy between our application and the outside world, and puts us in control of the cache and how to respond to resource requests. Our Service Worker allows us to cache essential resources to cut down on our dependence on the network, giving an instant and reliable experience for your users even when there is no internet.

Now the Angular team actually provides us with an easy tool to add a Service Worker as well as another set of tool (we'll get into them later), so let's install our tools with the following.

```bash
npm install --save @angular/service-worker @angular/platform-server ng-pwa-tools
```

That was easy, but we will also need to update our .angular-cli.json to tell it we want to include a Service Worker. That way, every time we make a production build, it will include our Service Worker.

```bash
ng set apps.0.serviceWorker=true
```

Now if we run a production build `ng build --prod` and check our `dist/` folder, we'll see a file called `ngsw-manifest.json` and if we look into it we will see all of our assets that will be cached by our Service Worker.

```json
{
  "static": {
    "urls": {
      "/polyfills.859f19db95d9582e19d4.bundle.js": "afac7bb7a75d8e31bca1d0a21bc8a8b8d5c8043c",
      "/main.9058c5e7c9cdfe8d2b7e.bundle.js": "93293a45586e8923695e614746ae61d658cde5ed",
      "/sw-register.e4d0fe23aa9c2f3a68bb.bundle.js": "2a8aea5c32b446b61dab2d7c18231c4527f04bdc",
      "/vendor.1fd4688f90e61a7dc14d.bundle.js": "92513639a29f19b868733d40bb37732fc051b326",
      "/inline.6e6ae94836243f3c1fa2.bundle.js": "7e89339e980b3fe1ac59ed6ee44800ad1c647084",
      "/styles.b11de945749bdbf0b1ca.bundle.css": "3e920bb539d1da98370748436c09677e81a50d46",
      "/assets/.DS_Store": "edc93fc6e9f594928b74bd2e15a23417aa68ac5d",
      "/assets/app-icon.png": "cd65256eb15ba9d4150e783ddaf93399799f605f",
      "/favicon.ico": "c31b53fba70406741520464040435aabaaed370e",
      "/index.html": "3953d6c604ff7dc6b9e77e8310cd7877d2b49b0d"
    },
    "_generatedFromWebpack": true
  }
}
```

But this doesn't include our routing configuration, so we can create one with the `ngu-sw-manifest` tool (part of `ng-pwa-tools` we installed before).

```bash
./node_modules/.bin/ngu-sw-manifest --module src/app/app.module.ts
```

Now, you probably got an error like this…

```bash
ENOENT: no such file or directory, open 'app.component.html' ;
```

Our `ngu-sw-manifest` tool isn't able to traverse through our application when there are relative paths for our component's templates and stylesheets. So we'll add `moduleId: module.id` to the `@Component` decorator of our three components. (`src/app/app.component.ts`, `src/app/home/home.component.ts`, and `src/app/movie/movie.component.ts`) So we should have decorators that look like this.

```typescript
@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
```

And if we run the failed `ngu-sw-manifest` command again we should see:

```json
{
  "routing": {
    "index": "/index.html",
    "routes": {
      "/": {
        "match": "exact"
      },
      "^/movie/[^/]+$": {
        "match": "regex"
      },
      "/movie": {
        "match": "exact"
      },
      "^/.*$": {
        "match": "regex"
      }
    }
  },
  "static": {
    "urls": {
      "/favicon.ico": "c31b53fba70406741520464040435aabaaed370e",
      "/index.html": "551a50f7e2847f7ed85cda1f8e4b7877bfdbb492",
      "/inline.341ede62d3a808c130e1.bundle.js": "79d61daf91c3d745aac6c274fadc4ac826332358",
      "/main.07650488997a7b2dfcc1.bundle.js": "49be3a9f04ebc4383806652e13f3be4ca58b3902",
      "/ngsw-manifest.json": "29a96adf2f918b27cc37be64b7ee24d15d095963",
      "/polyfills.859f19db95d9582e19d4.bundle.js": "afac7bb7a75d8e31bca1d0a21bc8a8b8d5c8043c",
      "/styles.b11de945749bdbf0b1ca.bundle.css": "3e920bb539d1da98370748436c09677e81a50d46",
      "/sw-register.e4d0fe23aa9c2f3a68bb.bundle.js": "2a8aea5c32b446b61dab2d7c18231c4527f04bdc",
      "/vendor.f47d925e37c84559515b.bundle.js": "cd70a6deaa413652cc98b444f793f5cf1e837be6",
      "/worker-basic.min.js": "93904d94c0bef0479f1ec0b182788f4301d9f28e",
      "/assets/.DS_Store": "edc93fc6e9f594928b74bd2e15a23417aa68ac5d",
      "/assets/app-icon.png": "cd65256eb15ba9d4150e783ddaf93399799f605f"
    }
  }
}
```

We're going to work with the above object in a bit, but first in our `src/` directory we're going to create a `ngsw-manifest.json` file and fill it like so.

```json
{
  "dynamic": {
    "group": [
      {
        "name": "firebase",
        "urls": {
          "https://ng-popular-movies-pwa.firebaseapp.com/": { // Our deployed app url
            "match": "prefix"
          }
        },
        "cache": {
          "optimizeFor": "performance", // grabs data from cache only if data is stale
          "maxAgeMs": 3600000, // cache for about an hour
          "maxEntries": 20, // minimize cache size
          "strategy": "lru" // tells service worker how to remove cached date (least recently used first)
        }
      }
    ]
  }
}
```

This sets our default caching strategy. (Modify the `dynamic.groups[0].name` and `dynamic.groups[0].urls` based on how you plan on hosting your app) Just remove the comments included, and now we can run the `ngu-sw-manifest` tool to take our assets, routing, and our custom defined manifest file and output it into our `dist/ngsw-manifest.json`.

```bash
./node_modules/.bin/ngu-sw-manifest --module src/app/app.module.ts \
  --out dist/ngsw-manifest.json
```

So now we're quickly going to update our `npm` scripts to the following:

```json
{
  "ng": "ng",
  "start": "ng serve",
  "start:pwa": "npm run build && cd dist && http-server",
  "build": "ng build --prod && npm run ngu-sw-manifest",
  "test": "ng test",
  "lint": "ng lint",
  "e2e": "ng e2e",
  "ngu-sw-manifest": "./node_modules/.bin/ngu-sw-manifest --module src/app/app.module.ts --out dist/ngsw-manifest.json"
}
```

Then we can run our app `npm run start:pwa`. Try running the application after disabling the network connection in the Chrome Dev Console, heck we can even run Lighthouse on it again!

![Working offline!](https://cdn-images-1.medium.com/max/800/1*NqoMN2P8irB-O-RjG0M0dg.gif)

![And a slightly better PWA score =)](https://cdn-images-1.medium.com/max/800/1*Mr_-An7gmWOuWYVOjGUdRA.png)

So we're doing a little bit better (some things like the HTTPS we wouldn't be able to fix until we deployed this). But at least we've doubled that PWA score! Next week we're going to up that score by improving our speed (perceived and real).

---

To look at the code differences from where we started to right now [click here](https://github.com/MichaelSolati/ng-popular-movies-pwa/compare/v0.0...v1.0?expand=1). Also if you feel so inclined, I invite you to deploy up your app to Firebase. If you run Lighthouse on the deployed app you'll get a much higher score:

![Lighthhouse on deployed app](https://cdn-images-1.medium.com/max/800/1*myNhaw95jrj4dGDbj9jjuQ.png)

---

Part two, titled "PWAs with Angular: Being Fast," is [available here](/blog/pwas-with-angular-being-fast).
