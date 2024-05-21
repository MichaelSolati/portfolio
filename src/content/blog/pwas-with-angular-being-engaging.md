---
title: "PWAs with Angular: Being Engaging"
description: We've made our Angular app reliable and fast, let's make it engaging and turn it into an awesome PWA!
pubDate: June 16 2017
hero: https://thepracticaldev.s3.amazonaws.com/i/l1vm0ze9607nh0myzbhf.png
---

This past week we've done a lot of work taking a regular old Angular application and turning it into a Progressive Web App. We've made our application *reliable* with the use of Service Workers ([click here](/blog/pwas-with-angular-being-reliable)); we also made out application *fast* by prerendering our home route and lazy loading our routes with modules ([click here](/blog/pwas-with-angular-being-fast)). We're missing one key component to building a PWA though: making our application *engaging*!

So what's the best way to go about making an engaging app? Two things.

 1. We want our application to offer a *native* experience, which for the most part our use of Angular Material does well, but it would be even better if users were able to *install* our PWA onto their launcher.
 2. Most apps are able to send push notifications, and with the use of our Service Worker we can do that too!

---

```bash
git clone --branch v2.0 https://github.com/MichaelSolati/ng-popular-movies-pwa.git
cd ng-popular-movies-pwa
npm install
```

*This app depends on [The MovieDB](https://www.themoviedb.org/)’s APIs. Get an API key ([check this out](https://www.themoviedb.org/faq/api?language=en)) and put it as the moviedb environment variable in your* `src/environments/environment.ts` *and* `src/environments/environment.prod.ts`*.*

We already do a lot to offer a native app experience, all we need to do now is allow our user to install our app. What we're going to need to do is add a Web App Manifest to our application. To get started I'm going to advise you visit [App Manifest Generator](https://app-manifest.firebaseapp.com/). This app will stub out a lot of what we need. You can fill out the fields however you want based on how you want your app to look and feel on the phone, but below is what I have selected. (I put it in JSON format for readability).

```json
{
  "name": "Popular Movies",
  "short_name": "Movies",
  "theme_color": "#ff1744",
  "background_color": "#212121",
  "display": "standalone",
  "orientation": "portrait",
  "scope": null,
  "start_url": "/index.html",
}
```

There's also an option to upload an icon so the generator can produce icons for the web app, lucky for us inside of our `src/assets/` directory there is an image called `app-icon.png`! (You should pick that)

After you have everything selected, just click the **GENERATE .ZIP** button.

![Web App Manifest Generator](https://thepracticaldev.s3.amazonaws.com/i/ro4yet9dsv5h5z43ty9s.png)

Unzip the `app-images.zip` that was downloaded. We're going to move the `manifest.json` file into our `src/` directory, and we're also going to take the `icons/` directory inside of the `images/` directory and move it into our `src/assests/` directory.

Then we're going to modify our `src/manifest.json` by removing the `"splash_pages": null` at the end of the object, and also change all of our icon sources from having the prefix path of `images/icons/` to `assets/icons/`. It should look like this...

```json
{
  "name": "Popular Movies",
  "short_name": "Movies",
  "theme_color": "#ff1744",
  "background_color": "#212121",
  "display": "standalone",
  "orientation": "portrait",
  "start_url": "/index.html",
  "icons": [
    {
      "src": "assets/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png"
    },
    {
      "src": "assets/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png"
    },
    {
      "src": "assets/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png"
    },
    {
      "src": "assets/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png"
    },
    {
      "src": "assets/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png"
    },
    {
      "src": "assets/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "assets/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png"
    },
    {
      "src": "assets/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

We now need to update our `src/index.html` to include the `manifest.json`, but we're also going to add a `theme-color` so when mobile browsers view our page, the browser's url bar will match that beautiful red we have as our app's navbar.

```html
<head>
  <meta charset="utf-8">
  <title>Popular Movies</title>
  <base href="/">

  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">

  <meta name="theme-color" content="#ff1744">
  <link rel="manifest" href="/manifest.json">
</head>
```

Finally we just need to tell our CLI to include the `src/manifest.json` file when it bundles our build. So we'll update our `angular-cli.json` to include it in the `apps[0].assets` array.

```json
[
  "assets",
  "favicon.ico",
  "manifest.json"
]
```

With all of that set, if we were to deploy this app and visit it, after a couple of uses, we would be prompted to add it to our home screen! (Keep in mind this prompt, as well as the push notifications we’re about to get into will only work if your app is served over HTTPS. If you’re using Firebase for your hosting, you’re all set to go!)

![PWA on mobile](https://thepracticaldev.s3.amazonaws.com/i/l1vm0ze9607nh0myzbhf.png)

---

The last thing we want to be able to do is send push notifications to our users. While a movie app like ours may not really need it, it’s still a good and easy feature to implement for potential down the road uses, and can improve our *engagement*.

At the end of our `src/ngsw-manifet.json` file (after the `dynamic` sub object) we're going to add a `push` object looking like this.

```json
"push": {
  "showNotifications": true
}
```

Now we’re telling our Service Worker when it receives a push notification to display it, but we still need to register to receive these notifications. We can do this by using the `NgServiceWorker` service from the `@angular/service-worker` package, and we'll also need to import our `ServiceWorkerModule` into our app from the service worker package.

In our `src/app/app.module.ts` we'll add:

```typescript
import { NgServiceWorker, ServiceWorkerModule } from '@angular/service-worker';
```

We'll add the `ServiceWorkerModule` to our `AppModule`'s imports, and we'll pass the `NgServiceWorker` as an argument of our `AppModule`'s constructor.

```typescript
constructor(private _moviesService: MoviesService, private _navbarService: NavbarService, private _sw: NgServiceWorker) { }
```

Web push requires that our messages are sent from a backend via the [Web Push Protocol](https://tools.ietf.org/html/draft-ietf-webpush-protocol). If we want to send data with our push messages we must also encrypt it following the [Message Encryption for Web Push spec](https://tools.ietf.org/html/draft-ietf-webpush-encryption). In order to get the require `Public Key` and `Private Key` we'll use the `web-push` libraries CLI ([details here](https://github.com/web-push-libs/web-push#command-line)).

```bash
npm install -g web-push
web-push generate-vapid-keys
```

The `web-push` CLI will provide is with both the `Public Key` and `Private Key` we need for our application. The `Private Key`, well, *it's a secret to everybody*... So save it somewhere because you would use it on your server to send messages to users, but the `Public Key` we will use right away. Like with The MovieDB’s API we are going to add it to our `src/environments/environment.ts` and `src/environments/environment.prod.ts`. You should create a new key called `applicationServerKey` and assign your key to that.

Now we can import our `environment` into our `src/app/app.module.ts` like so:

```typescript
import { environment } from '../environments/environment';
```

Then in the constructor of our `AppModule` we'll register for our push notification.

```typescript
constructor(private _moviesService: MoviesService, private _navbarService: NavbarService, private _sw: NgServiceWorker) {
  this._sw.registerForPush({
    applicationServerKey: environment.applicationServerKey
  }).subscribe((sub: any) => {
    // Use details to register on your server to send notifications to this device
    console.log(sub);
  });

  this._sw.push.subscribe((msg: any) => {
    // Handle message when in app
    console.log(msg);
  });
}
```

Now we have registered our Service Worker to receive and display notifications, we can actually test it when we run our server (`npm run start:pwa`) like seen below.

![Push notifications](https://thepracticaldev.s3.amazonaws.com/i/vk0cp5mycetqtwkkbu9v.png)

When we take our application through the Lighthouse test we’re scoring up in the 80s for our PWA score (and we don’t need to be too concerned with the Performance score right now only because it’s mostly reflective of all the images we load as well as our other small factors outside of our control).

![localhost Lighthouse testing](https://thepracticaldev.s3.amazonaws.com/i/006jotyrq3wf7axogrrg.png)

---

Well, we’ve done it! We’ve taken a very basic web application written in Angular and turned it into a Progressive Web App. It’s *reliable*, *fast*, and *engaging*! While their are a few visual tweaks we can make to improve the overall experience, our application is in a really good place right now! You can [view the changes in our code from the last article to this one here](https://github.com/MichaelSolati/ng-popular-movies-pwa/compare/v2.0...v3.0?expand=1), and if you want to see this app [running in the wild here](https://ng-popular-movies-pwa.firebaseapp.com/) (I recommend trying it on your mobile phone).

Finally, I guess the most exciting and important question is how *good* of a PWA do we have when we deploy it? Well, why don’t you take a look below:

![Deployed Lighthouse testing](https://thepracticaldev.s3.amazonaws.com/i/7fk7vj250xung6j1lxu0.png)