---
title: And then the interviewer asks, "Can you do this with less code?"
description: ""
pubDate: May 8 2020
hero: https://dev-to-uploads.s3.amazonaws.com/i/wdnkqs71f7h3k0zliuuw.png
---

I LOVE fun solutions to interview problems. When prepping for interviews, I believe it's important to understand the capabilities and data structures in any given language as they can help you solve menial problems more efficiently.

An interesting interview problem I once had was, "Given an array of n numbers, how would you find if there are any duplicates?"

When faced with this problem as a junior JavaScript developer, I thought the solution would be simple. Just sort the array and then loop through it, while comparing the current index with the previous index. If they match, a duplicate is found!

```javascript
const duplicateCheck = (numbers) => {
  // Sort the numbers
  numbers = numbers.sort();

  // Loop through the numbers
  for (let i = 0; i < numbers.length; i++) {
    if (i > 0) {
      // Compare the current index with the previous
      if (numbers[i] === numbers[i-1]) {
        // If they match we found a duplicate, we can stop here
        return true;
      }
    }
  }

  return false;
};
```

Sure this works, and your interviewer seems happy, but then they ask, "Can you make it faster?" Then you realize that maybe this isn’t the best solution... While the initial sort is fairly fast, running with a time complexity of `Θ(n log(n))`, we also have a loop after it with a time complexity of `Θ(n)`. At the end of the day, the function itself runs at `Θ(n log(n))` and it may not be the fastest solution.

Okay, let's simplify this to a single loop. We could just loop through the unsorted array and keep track of the values already found. If we end up finding a value we already checked, then we know we have a duplicate and we can stop there.

```javascript
const duplicateCheck = (numbers) => {
  // Store found numbers
  const found = {};

  // Loop through the numbers
  for (let number of numbers) {
    // If number has been seen
    if (found[number]) {
      // End it here, we found a duplicate
      return true;
    } else {
      // If we didn't see it yet, let's log that we've seen it once
      found[number] = true;
    }
  }

  return false;
};
```

This is neater and faster! Its time complexity is now `Θ(n)` since we loop through the array, but we skip the sort. This is a faster solution, and you start to feel good about how the interview is going. And then the interviewer asks, "Can you do this with less code?"

After your heart skips a beat and dread sets in, you remember something your friend (me) said: "It's important to understand the capabilities and data structures in any given language." In JavaScript, you have access to the `Set` object!

> Set objects are collections of values. You can iterate through the elements of a set in insertion order. A value in the Set may only occur once; it is unique in the Set's collection.
>
> -  <cite>[MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)</cite>

So you write the following:

```javascript
const duplicateCheck = (a) => new Set(a).size !== a.length;
```

By passing the array into a new `Set`, you know that the Set will not allow for any duplicate elements to be added. You now have an iterable without duplicates. The final step is to compare the size of the deduped `Set` against the length of the original array. If they're the same, then there are no duplicates. If they're different, you know that duplicates were removed.

You now have a solution that keeps the time complexity of `Θ(n)` without the need of a for loop and without needing to keep track of numbers already seen. Instead, you have a neat one-line solution.

I love these one-line solutions! Hopefully, you found this helpful. If you have any interesting or clever solutions to interview questions, I'd love to hear them in the comments. Or if you have a better solution to finding duplicates in an array, I'd love to hear that too.

---

To keep up with everything I’m doing, follow me on [Twitter](https://twitter.com/MichaelSolati) and [dev.to](https://dev.to/michaelsolati). If you’re thinking, _“Show me the code!”_ you can find me on [GitHub](https://github.com/MichaelSolati).
