---
title: "PWAs with Angular: Being Fast"
description: Taking a look at how to make our Angular PWAs load even faster.
pubDate: June 14 2017
hero: https://thepracticaldev.s3.amazonaws.com/i/gqv0mbg95o2srvs9qy88.png
---

Earlier in the week we looked at starting to turn a basic Angular application into a Progressive Web App ([you can catch up here](/blog/pwas-with-angular-being-reliable)). Now that we have an application that is *reliable* and will load content from cache even when there's no network, let's make our application fast!

---

```bash
git clone --branch v1.0 https://github.com/MichaelSolati/ng-popular-movies-pwa.git
cd ng-popular-movies-pwa
npm install
```

*This app depends on [The MovieDB](https://www.themoviedb.org/)'s APIs. Get an API key ([check this out](https://www.themoviedb.org/faq/api?language=en)) and put it as the moviedb environment variable in your* `src/environments/environment.ts` *and* `src/environments/environment.prod.ts`*.*

Lets run our application `npm run start:pwa`, and then disable JavaScript in our browser. All our user would get is a black screen:

![No JavaScript](https://cdn-images-1.medium.com/max/800/1*GajqzGUfO8nvCuWVxivk-Q.png)

This is definitely not PWA behavior, and actually ties back to our last topic of having a *reliable* application. So lets fix that with one of the tools in our `ng-pwa-tools` package we added to our application last time. Specifically we will be using the `ngu-app-shell` tool.

First, we're going to go into `src/app/app.module.ts` file and change our `BrowserModule` import on line 22 to `BrowserModule.withServerTransition({ appId: 'ng-popular-movies-pwa' })`. (The `withServerTransition()` function configures our browser based application to transition from a pre-rendered page, details to come) Now lets run our `ngu-app-shell`.

```bash
./node_modules/.bin/ngu-app-shell --module src/app/app.module.ts
```

You should have seen logged into your terminal our entire home route rendered out! We have all of our HTML, CSS, and even data grabbed from The MovieDB. What our `ngu-app-shell` did was prerender out our index route much in the same way that [Angular Universal](https://universal.angular.io/) does.

With a prerendered home route, we don't need to worry if our user has JavaScript disabled, or if it takes a while for our JS bundles to download and execute. We have content already rendered into HTML. So we can use the `ngu-app-shell` to replace our empty `dist/index.html` with a rendered out page.

```bash
./node_modules/.bin/ngu-app-shell --module src/app/app.module.ts \
  --out dist/index.html
```

While we're here, let's update our `npm` scripts to the following.

```json
{
  "ng": "ng",
  "start": "ng serve",
  "start:pwa": "npm run build && cd dist && http-server",
  "build": "ng build --prod && npm run ngu-app-shell && npm run ngu-sw-manifest",
  "test": "ng test",
  "lint": "ng lint",
  "e2e": "ng e2e",
  "ngu-app-shell": "./node_modules/.bin/ngu-app-shell --module src/app/app.module.ts --out dist/index.html",
  "ngu-sw-manifest": "./node_modules/.bin/ngu-sw-manifest --module src/app/app.module.ts --out dist/ngsw-manifest.json"
}
```

![App rendered with no JavaScript](https://cdn-images-1.medium.com/max/800/1*MW2Lgt1KeF17YKw8weVSXg.png)

Not only is this a better experience for when our user has JavaScript disabled, this is an inherently faster process. When we pass an already rendered page to the user, we do not need to wait for our code to run. Instead we give the user something as soon as the HTML loads, then we let our `BrowserModule` transition in our Angular app to replace the rendered content.

---

Another way we can speed up our application is "lazy loading" parts of our application. In Angular we can lazy load modules, which essentially means we can group related pieces of code together and load those pieces on demand. Lazy loading modules decreases the startup time because it doesn't need to load everything at once, only what the user *needs* to see when the app first loads.

In our current structure we only have two routes, one module, and essentially two components (I'm excluding the `AppComponent` because all it does is provide our navigation bar). So let's create a new module for our `HomeComponent` and our `MovieComponent` and put the components into those modules.

```bash
ng g m home
ng g m movie
```

Next let's change our `src/app/home/home.module.ts` to look like this.

```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@angular/material';
import { RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forChild([
      { path: '', pathMatch: 'full', component: HomeComponent }
    ])
  ]
})
export class MovieModule { }
```

Now we'll change our `src/app/movie/movie.module.ts`, making it similar to our `HomeModule`.

```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@angular/material';
import { RouterModule } from '@angular/router';

import { MovieComponent } from './movie.component';

@NgModule({
  declarations: [
    MovieComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forChild([
      { path: '', pathMatch: 'full', component: MovieComponent }
    ])
  ]
})
export class MovieModule { }
```

We should also update `src/app/app-routing.module.ts` to reflect that we will be lazily loading our routes from our modules.

```typescript
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: 'app/home/home.module#HomeModule'
  }, {
    path: 'movie/:id',
    loadChildren: 'app/movie/movie.module#MovieModule'
  }, {
    path: 'movie',
    redirectTo: '/',
    pathMatch: 'full'
  }, {
    path: '**',
    redirectTo: '/'
  }
];

export const routing = RouterModule.forRoot(routes);
```

Finally we'll update our `src/app/app.module.ts` to reflect our new `routing`, as well as remove any reference of our components.

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';

import { MoviesService } from './services/movies.service';
import { NavbarService } from './services/navbar.service';

import { routing } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-popular-movies-pwa' }),
    HttpModule,
    BrowserAnimationsModule,
    MaterialModule,
    routing
  ],
  providers: [
    MoviesService,
    NavbarService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private _moviesService: MoviesService, private _navbarService: NavbarService) { }
}
```

---

By prerendering our home route as well as lazy loading all of our routes we were able to not only make our application *faster* but also more *reliable*! While this application may not have many routes that lazy loading can shave off seconds from our initial load time, for your bigger applications it definitely will.

By running the Lighthouse tests on our current app, we can see our PWA and Performance scores nudge up from 36 each (taking the score from the previous article which was not using a deployed app), to 45 and 61 respectively.

![Better Lighthouse scores](https://cdn-images-1.medium.com/max/800/1*umit5ddO5DumvUlq-OI0Ow.png)

---

You can look at the changes we made in our code by [clicking here](https://github.com/MichaelSolati/ng-popular-movies-pwa/compare/v1.0...v2.0?expand=1). Additionally, if you run Lighthouse on a deployed version of our application you'll start to get results looking like this:

![Deployed Lighthouse test](https://cdn-images-1.medium.com/max/800/1*2D9NiKu1sl5-vaXLlaHFRg.png)

---

Final part of the series, titled "PWAs with Angular: Being Engaging," is [available here](/blog/pwas-with-angular-being-engaging).
