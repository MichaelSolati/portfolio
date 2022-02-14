# Portfolio

A portfolio designed for lazy developers all over the world. With little configuration and maintanince let this application automatically update itself without you having to lift a finger!

![The home page](./screenshots/home.png)

As a Developer 🥑 (Advocate) I speak at events, write blog posts, and maintain some libraries. I wanted to create a website that would showcase all of this, and I created this project to fetch from [dev.to](https://dev.to), [GitHub](https://github.com) and a [YouTube](https://youtube.com) playlist!

- My experience is pulled from [LinkedIn](https://linkedin.com) and is shown on [`/`](https://michaelsolati.com/).
- Articles I've written on dev.to are shown on [`/articles`](https://michaelsolati.com/articles).
- My most starred and recent GitHub repos are shown on [`/code`](https://michaelsolati.com/code).
- Recorded talks are fetched from a YouTube playlist and shown on the [`/talks`](https://michaelsolati.com/talks).

Almost all of this is configured from a few JSON files in [`src/_data`](src/_data).

---

## Getting Setup

We'll keep our first step simple and just run a `npm ci` command. You will also want `firebase-tools` installed as a global dependency on your machine. Just run the command `npm i -g firebase-tools` and be sure to sign into your Google account for the `firebase-tools` with the command `firebase login`.

### Configuration

Some basic details used for generating pages and fetching content on the site is found in the [`src/_data/about.json`](src/_data/about.json). Below is an interface explaining the site's data structure. If you don't want one of the optional fields, delete it.

```TypeScript
interface About {
  name: string; // Your name.
  shortName: string; // Short name for PWA.
  devto?: string; // dev.to username.
  github?: string; // Twitter username.
  linkedin?: string; // LinkedIn custom URL, `www.linkedin.com/in/<THIS>`.
  youtubePlaylist?: string; // YouTube Playlist ID.
}
```

#### LinkedIn

I would like to automate this but LinkedIn makes it near impossible. Using this [Chrome extension](https://chrome.google.com/webstore/detail/json-resume-exporter/caobgmmcpklomkcckaenhjlokpmfbdec). Generate a JSON and save the content in [`src/_data/linkedin.json`](src/_data/linkedin.json).

#### Firebase

This application takes advantage of Firebase for the use of its [Hosting](https://firebase.google.com/products/hosting) and [Google Analytics](https://firebase.google.com/docs/analytics). In the [Firebase console](https://console.firebase.google.com/) create a new application, and ensure that these features are enabled. Typically they would be enabled from the get-go, but you may want to check just in case.

Update the `.firebaserc` file in the root directory so that `projects.default` is assigned to your Project ID. The easiest way to do this is just to delete the file and run the command `firbase init` to assign it to your project.

Next update [`src/_data/firebase.json`](src/_data/firebase.json) with your Firebase config details.

#### YouTube

You will also need to enable the YouTube Data API v3 for your Firebase application, which [you can do here](https://console.developers.google.com/apis/library/youtube.googleapis.com/). Generate an API token for this and use set it as an environment variable called `YOUTUBE`. If you don't want to keep setting it you can set it once in a git ignored `.env` file.

## Let's Wind Up

With everything configured and data generated you can test the site by running:

```bash
npm run start
```

If everything looks good then we're ready to deploy to Firebase, run:

```bash
npm run build
firebase deploy
```

Enjoy!
