---
title: My Portfolio Site... For You!
description: ""
pubDate: May 20 2020
hero: https://dev-to-uploads.s3.amazonaws.com/i/5aanidovegngwi1hyzd3.gif
---

Over the past weekend I decided to redo my portfolio website, [michaelsolati.com](https://michaelsolati.com), a task which I was dragging my feet on. As a Developer 🥑 (Advocate) I speak at events, write blog posts, and maintain some libraries. When re-doing my portfolio I wanted to showcase all of that without ever needing to update the site. The new site does all that and a more, such as:

- It rips my work experience from [LinkedIn](https://linkedin.com) via [Puppeteer](https://pptr.dev/) and shows it on [`/`](https://michaelsolati.com).
- Articles I've written on dev.to are shown on [`/articles`](https://michaelsolati.com/articles).
- My most starred and recent GitHub repos are shown on [`/code`](https://michaelsolati.com/code).
- Recorded talks are fetched from a YouTube playlist and shown on [`/talks`](https://michaelsolati.com/talks).
- Two themes are available, one for devices using light mode and one for dark mode.
- It works when JavaScript is disabled thanks to SSR running on Firebase Functions.
- It also works offline thanks to a service worker.
- It grabs my dev.to profile picture and saves it, as well as generates PWA icons from the profile picture.
- Updates the `manifest.webmanifest` file.
- Saves all the cover image or social image from my dev.to posts.
- Saves all the previews images of the YouTube videos in the playlist.
- Generate screenshots that can be used for sites like Twitter of Facebook.
- GitHub Actions will update all the data and images then deploy to Firebase once a week.

It honestly does a lot, but here's the exciting part...

## IT IS ALL CUSTOMIZABLE!

Meaning you can fork it and only need to update the [`environment.general.ts`](https://github.com/MichaelSolati/portfolio/blob/master/src/environments/environment.general.ts) file in order to have the site completely customized for you.

The project is available on [GitHub](https://github.com/MichaelSolati/portfolio), just checkout the [README](https://github.com/MichaelSolati/portfolio#portfolio) to get started.

Enjoy y'all!

---

To keep up with everything I’m doing, follow me on [Twitter](https://twitter.com/MichaelSolati) and [dev.to](https://dev.to/michaelsolati). If you’re thinking, _“Show me the code!”_ you can find me on [GitHub](https://github.com/MichaelSolati).
