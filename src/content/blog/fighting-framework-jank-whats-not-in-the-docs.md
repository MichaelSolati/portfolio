---
title: Fighting Framework Jank (What's Not in the Docs)
description: Is your React app feeling slow? Stop blaming the framework and use your browsers APIs like template and requestIdleCallback to fix that UI jank.
tags: webdev,performance,react,frontend
pubDate: Tue Nov 11 2025 21:00:00 GMT-0800 (Pacific Standard Time)
hero: /blog/fighting-framework-jank-whats-not-in-the-docs/hero.webp
---

I’ve been there. We’ve *all* been there. You've just shipped a new dashboard. It’s got charts, it’s got tables, it’s got pizazz ✨. And on your fancy, company issued, 16" MacBook Pro, it flies. Buttery smooth But then the first bug report comes in:

> Dashboard is laggy.

Or maybe you see a "it feels slow," or my personal favorite, "the page is janky."

You open it on a different machine, like your cell phone, and your heart sinks... Those smooth animations are stuttering. The clicks feel... off. And then creeps in that moment of dread, "Is React (or Vue, or Angular) just... slow?"

After going through an existential crisis (doubting my years as a software developer and realizing that my imposter syndrome is very justified) I then decided to blame the framework or some library I was using. But after profiling the *very* janky dashboard I realized the problem wasn't the framework at all.

The problem was me. I was so focused on the "framework way" of doing things that I was ignoring the most powerful performance tool I had: the browser itself.

## The "Framework-Pure" Problem

Let's look at a simplified version of my janky component. It had two main jobs:

1. Render a massive, complex, but totally static SVG icon.
2. Fire off an analytics event as soon as it rendered to track that it was visible.

The "pure React" way to write this looked something like this:

```tsx
import React, { useEffect } from 'react';

// Imagine this component returns a <svg> with hundreds of <path> elements
import { MyHugeStaticChartIcon } from './MyHugeStaticChartIcon'; 
import { sendAnalyticsEvent } from './analytics';

function JankyWidget() {
  useEffect(() => {
    // Fire this off as soon as we mount
    sendAnalyticsEvent('widget_visible', { detail: '...' });
  }, []);

  return (
    <div className="widget">
      <h3>My Janky Widget</h3>
      <MyHugeStaticChartIcon />
    </div>
  );
}
```

This code *looks* right, but it's a performance nightmare. Here's why:

1. **Hydration Cost:** React has to create a Virtual DOM node for every single one of those hundreds of `<path>` elements inside the SVG. That’s a ton of JavaScript objects to create and memory to allocate for something that *will never change*.
2. **Main Thread Blockage:** The `useEffect` fires right after mount. That `sendAnalyticsEvent` function, even if it's quick, is still work that's happening on the main thread. It's competing for resources with the browser, which is still trying to paint the screen and respond to the user's scroll.

This combination is what creates the "jank." The main thread is just too busy.

<iframe
  src="https://stackblitz.com/edit/vitejs-vite-segdqqbc?embed=1&ctl=1&hidedevtools=1&file=src%2Fpages%2FJankyWidget.tsx&initialpath=janky"
  style="width: 100%; aspect-ratio: 16 / 9; border: 0;"
  loading="lazy"
  title="Janky Example"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen>
</iframe>

You can play with the janky version above!

## The "One Weird Trick": Offload It to the Browser

After hours of profiling, the "Aha!" moment hit me. The fix isn't a new library. It's to **stop** asking the framework to do things the browser is already amazing at.

This "trick" has two parts:

1. Offload **parsing** with the `<template>` tag.
2. Offload **execution** with `requestIdleCallback`.

## Part 1: The `<template>` Tag for Heavy Lifting

First, that massive SVG. It's static. So why are we making JavaScript build it?

The `<template>` tag is a native HTML element that is completely inert. The browser parses its content, but it doesn't render it, run scripts in it, or download images. It's just a chunk of DOM waiting to be used.

**Step 1:** Put your static HTML into your `index.html`.

```html
<template id="my-chart-icon-template">
  <svg width="100" height="100" viewBox="0 0 100 100">
    <g>
      <path d="...a-very-complex-path..." />
      <path d="...another-complex-path..." />
      </g>
  </svg>
</template>
```

**Step 2:** Tweak your component to clone this content.

```tsx
import React, { useRef, useEffect } from 'react';
// ...
 
function FastWidget() {
  const chartContainerRef = useRef(null);
  useEffect(() => {
    // 1. Find the template
    const template = document.getElementById('my-chart-icon-template');
    // 2. Clone its content (this is super fast)
    const content = template.content.cloneNode(true);
    // 3. Stamp it into our component
    if (chartContainerRef.current) {
      chartContainerRef.current.appendChild(content);
    }
    // ... analytics call will go here ...
  }, []);

  return (
    <div className="widget">
      <h3>My Fast Widget</h3>
      {/* This is now just an empty container */}
      <div ref={chartContainerRef} />
    </div>
  );
}
```

Boom. We just saved React from having to manage hundreds of virtual DOM nodes. We offloaded all that parsing work to the browser, which it does much more efficiently.

## Part 2: `requestIdleCallback` for the "Nice-to-Haves"

Okay, the component renders faster, but that analytics call is still blocking the main thread in `useEffect`. This is where the second part of our "trick" comes in.

`requestIdleCallback` is a browser API that's like saying, "Hey browser, I know you're busy. When you get a free second and you're not busy with user input or animations, could you please run this function for me?"

It's *perfect* for non-critical tasks like analytics.

Let's add it to our `useEffect`:

```tsx
// ... inside our FastWidget component ...
  useEffect(() => {
    // --- Template code from above ---
    const template = document.getElementById('my-chart-icon-template');
    const content = template.content.cloneNode(true);
    if (chartContainerRef.current) {
      chartContainerRef.current.appendChild(content);
    }
    // --- Our new, non-blocking analytics call ---
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        sendAnalyticsEvent('widget_visible', { detail: '...' });
      });
    } else {
      // Fallback for older browsers
      setTimeout(() => {
        sendAnalyticsEvent('widget_visible', { detail: '...' });
      }, 0);
    }
  }, []);
```

## The Payoff

And just like that, the jank is gone.

Our component now renders instantly. The state update (if we had one) happens immediately. The heavy-lifting of parsing the SVG is handled by the browser. And the non-critical analytics call waits politely for its turn when the main thread is free.

I love this kind of solution! It's not about "React vs. Vanilla JS." It's about remembering that your framework is a guest in the browser's house. By respecting the browser and using the native tools it provides, you can make your framework based apps feel infinitely faster.

So next time you're facing down some "jank," don't just reach for a new library. Ask yourself, "Can I just offload this to the browser?"

<iframe
  src="https://stackblitz.com/edit/vitejs-vite-segdqqbc?embed=1&ctl=1&hidedevtools=1&file=src%2Fpages%2FFastWidget.tsx&initialpath=fast"
  style="width: 100%; aspect-ratio: 16 / 9; border: 0;"
  loading="lazy"
  title="Fast Example"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen>
</iframe>
