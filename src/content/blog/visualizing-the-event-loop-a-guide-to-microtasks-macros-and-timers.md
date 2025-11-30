---
title: "Visualizing the Event Loop: A Guide to Microtasks, Macros, and Timers"
description: Stop guessing the output of async code. Here is a visual mental model for the JavaScript Event Loop, Microtasks, and Macrotasks.
tags: webdev,javascript,beginners,node
pubDate: Wed Nov 25 2025 08:00:00 GMT-0800 (Pacific Standard Time)
hero: /blog/visualizing-the-event-loop-a-guide-to-microtasks-macros-and-timers/hero.webp
---

I LOVE digging into the "weird" parts of JavaScript. When prepping for technical interviews, or just trying to debug why a UI update isn't rendering when I expect it to, I believe it's critical to understand not just *what* the language does, but *how* it schedules it.

An interesting scenario I often throw at folks (and have been thrown at me) is the classic "predict the output" game. It seems simple on the surface, but it quickly reveals if you have a solid mental model of the [JavaScript execution model](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model).

## The Challenge

Imagine looking at this snippet. What order do the numbers print in?

```javascript
console.log('1. Start');

setTimeout(() => {
  console.log('2. Timeout');
}, 0);

Promise.resolve().then(() => {
  console.log('3. Promise');
});

console.log('4. End');
```

When faced with this as a junior developer, I used to think: "Okay, code runs top to bottom. But `setTimeout` is asynchronous, so it waits. `Promise` is also async. So maybe 'Start', 'End', then... whichever one is faster?"

If you guessed: `Start` -> `End` -> `Timeout` -> `Promise`, you'd be following logical intuition, but you'd be wrong.

The actual output is:

1. `1. Start`
2. `4. End`
3. `3. Promise`
4. `2. Timeout`

Wait, why? `setTimeout` has a delay of `0`, so shouldn't it run immediately after the main code finishes?

After the anxiety settles, remember something your friend (me) said: "It's important to understand the capabilities and data structures in any given language." In this case, we need to talk about the [**Event Loop**](https://html.spec.whatwg.org/multipage/webappapis.html#event-loops), and specifically, the difference between **Macrotasks** and **Microtasks**.

## The Model: Visualizing the Traffic

To understand why the Promise beats the Timeout, we have to look at the architecture. JavaScript utilizes a single main thread of execution coupled with a sophisticated mechanism known as the Event Loop. It can only do one thing at a time.

Here is the flow you need to visualize:

1. **The Call Stack:** This is where your code runs. "Start" and "End" happen here immediately.
2. **The Web APIs:** When the browser sees `setTimeout`, it hands that timer off to the Web APIs (or `libuv` in Node.js). Even with a delay of `0`, it doesn't go back to the stack; it goes to a Queue.
3. **The Queues:** This is where the magic (and confusion) happens. There isn't just one queue.
    * **The Macrotask Queue (Task Queue):** This holds things like `setTimeout`, `setInterval`, and I/O operations.
    * **The Microtask Queue:** This holds `Promise` callbacks (`.then`, `.catch`, `.finally`), `queueMicrotask`, and `MutationObserver`.

## The Breakdown: The VIP Lane

Here is the golden rule that solves the puzzle: **The Event Loop performs a [Microtask Checkpoint](https://html.spec.whatwg.org/multipage/webappapis.html#perform-a-microtask-checkpoint) immediately after the Call Stack empties.**

Microtasks are like VIPs at a club. They get to cut the line. But more importantly, the Event Loop processes the [Microtask Queue exhaustively](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide/In_depth). If a microtask schedules *another* microtask, it gets added to the same queue and processed in the same cycle. The runtime will not move on to the next Macrotask (or even update the UI!) until the VIP section is completely empty.

Let's trace our code again with this model:

1. `console.log('1. Start')`: Pushed to Call Stack. Executed. Popped.
   * **Output:** `Start`
2. `setTimeout(..., 0)`: Pushed to Stack. The engine sees it's a timer, hands it to Web APIs. The Web API sees 0ms delay, so it queues the callback into the **Macrotask Queue**.
3. `Promise.resolve().then(...)`: Pushed to Stack. The engine sees a Promise resolution. It queues the `.then()` callback into the **Microtask Queue**.
4. `console.log('4. End')`: Pushed to Stack. Executed. Popped.
   * **Output:** `End`
   * Now, the global code is done. The Call Stack is empty. The Event Loop wakes up and asks: *"Is there anything in the Microtask Queue?"* Yes, there is! The Promise callback.
5. The Event Loop moves the Promise callback to the Call Stack. Executed.
    * **Output:** `Promise`
    * Now the stack is empty again. The Event Loop asks: *"Any more Microtasks?"* No. *"Okay, let's move on."*
6. **Rendering (Browser Only):** At this point, the browser decides if it needs to update the rendering Layout/Paint. This happens *after* microtasks but *before* the next Macrotask.
7. The Event Loop moves the Timeout callback to the Call Stack. Executed.
    * **Output:** `Timeout`

## The Solution: One Loop to Rule Them All

So, next time you're faced with a snippet like this—whether in an interview or a tricky debugging session—you don't need to rely on intuition. You just need to trust the hierarchy.

```javascript
const eventLoopCheck = () => {
  console.log('Script Start');   // 1. Synchronous

  setTimeout(() => {
    console.log('setTimeout');   // 3. Macrotask (Low Priority)
  }, 0);

  Promise.resolve().then(() => {
    console.log('Promise');      // 2. Microtask (High Priority)
  });
};
```

### The Cheat Sheet

* **Synchronous Code:** Runs first (Call Stack).
* **Microtasks (Promises):** Run immediately after the stack clears, *before* rendering or new tasks.
* **Rendering:** (Browser only) Happens after Microtasks but *before* the next Macrotask.
* **Macrotasks (Timers):** Run only when the stack AND the Microtask queue are empty.

> ### A Note for Node.js Developers
>
> If you are running this in Node.js, there is a "Super VIP" lane called `process.nextTick`. This runs even before Promises!.
>
> In Node.js, [`process.nextTick`](https://nodejs.org/en/learn/asynchronous-work/understanding-processnexttick) is technically not part of the Event Loop phases; it is processed immediately after the current operation completes. This means `nextTick` can actually starve your I/O if you aren't careful!

---

I love these visual mental models! Hopefully, you found this helpful. If you have any interesting or clever ways you visualize the Event Loop, I'd love to hear them! Or if you have a trickier code snippet that stumps people, I'd love to see that too.
