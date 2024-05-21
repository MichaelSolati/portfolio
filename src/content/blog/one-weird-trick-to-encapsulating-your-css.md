---
title: One weird trick! (To encapsulating your CSS)
description: ""
pubDate: Apr 29 2020
hero: https://dev-to-uploads.s3.amazonaws.com/i/gr3ryjpupymopqjrl0df.png
---

Web developers are going to hate me, cause this is an *interesting* solution...

Need to encapsulate the CSS of some HTML5? Well you can use an `<iframe>` to embed your HTML into a page without the rest of the page's CSS affect it using the `srcdoc` property!

Why would you want to do this? Well I'm currently working on including the content of the newsletters we email out on [web.dev](https://web.dev) on the website. However they all have their own custom styling that we don't want the CSS of the site to conflict them.

An `<iframe>` would allow us to encapsulate the styling so that there is no conflict, but it would be gross to point the `<iframe>` to another URL on the site as we would need another network request in order to render the page (and a search engine could crawl the embedded URL, which we wouldn't want to surface). So the easy solution was to use `srcdoc` to dump the HTML of a newsletter into the `<iframe>` without requiring another network request, or for another page to exist somewhere!

<iframe src="https://stackblitz.com/edit/iframe-css-encapsulation?file=index.html" width="100%" height="500" scrolling="no" frameborder="no" allowfullscreen="" allowtransparency="true" loading="lazy"></iframe>

---

To keep up with everything I’m doing, follow me on [Twitter](https://twitter.com/MichaelSolati). If you’re thinking, _“Show me the code!”_ you can find me on [GitHub](https://github.com/MichaelSolati).
