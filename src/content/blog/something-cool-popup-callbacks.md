---
title: "Something Cool: Popup Callbacks"
description: I had to get data from a popup window, this is how I did it!
pubDate: Apr 25 2019
hero: https://thepracticaldev.s3.amazonaws.com/i/ejdgg8ltgc8gqdiozklg.jpg
---

## Problem

Imagine that you need to direct a user to a different web page/domain and would like to know when they've completed whatever it is that you needed them to do.

## Background

I'm currently working on a Wordpress plugin which requires OAuth so that I can allow them to do, well, stuff! (I don't think I can disclose that right now...) While I could account for one or two redirect URIs, it would be IMPOSSIBLE for me to handle that for EVERY DOMAIN THAT MY WORDPRESS PLUG IN IS RUNNING ON!!!!

## Solution

What I opted to do in the plugin is to open a page that I host when a user clicks on the OAuth button.

```javascript
const newWindow = window.open('https://somesite.com/oauth', 'oauth', 'height=720,width=480');
```

As soon as I create the new window I'm able to extend the current `window` object by adding a function:

```javascript
window.popUpCallback = (code) => {
    newWindow.close();
    console.log(code);
};
```

Now on my pop up that will handle the authorization, after it gets the authorization code it can call the function I added to the window:

```javascript
window.opener.popUpCallback(value);
```

What happened here is that my popup window will call the `popUpCallback` function that I added to the `window` that opened this current (new) `window`.

Looking back at my `popUpCallback` function you see that I close the `newWindow` (the popup) and then `console.log` the code I got back. However you can do anything you want now. What you've done is passed a value between windows!

For me this was perfect because now I only need to have one redirect URI no matter where this plugin is run, but maybe this will be useful for you for some other reason.

Enjoy!

---

To keep up with everything I’m doing, follow me on [Twitter](https://twitter.com/MichaelSolati). If you’re thinking, _“Show me the code!”_ you can find me on [GitHub](https://github.com/MichaelSolati)
