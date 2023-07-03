---
title: JavaScript Objects
description: This blog post is your crash course for you to learn about one of the vital topics in JavaScript, i.e., JavaScript Objects.
pubDate: Dec 20 2022
hero: https://dev-to-uploads.s3.amazonaws.com/uploads/articles/g2y60a6osx9eagi84cst.png
---

This blog post is your crash course for you to learn about one of the vital topics in JavaScript, i.e., JavaScript Objects.

![JavaScript Meme](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/g2y60a6osx9eagi84cst.png)

There are two ways JavaScript data can be defined either a [Primitive](https://developer.mozilla.org/en-US/docs/Glossary/Primitive) or an Object. Objects are what most developers interact with. Some Objects you may be familiar with are:

- String
- Number
- Math
- Date
- Array
- Functions
- And [so much more](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)!

JavaScript objects are mutable, and their values can be changed. Objects can have properties and methods as well. It's crucial to remember [JavaScript is designed on a simple object-based paradigm](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects#:~:text=JavaScript%20is%20designed%20on%20a,is%20known%20as%20a%20method.). 

Objects are collections of properties, and properties are an association between a key and a value. In some cases, though, the value of a property is a function, making that property a method. The properties of an object usually describe the characteristics of its variable. For example, an Array has `.length` to know how many elements are in them. The Math object has a `.PI` property, in case you get hungry.

![First Code Snippet](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/noi01v7dlhesrcgl9xkx.png)

Methods behave differently, as they're functions that need to be called. They can be used to modify or convert a property of an object, perform an action, return a specific piece of information, and more. For example, if you've worked with a String, you may have called the `toUpperCase()` method to get the string in complete upper case.

Likewise, with an Array, you could call `.sort()` to sort the elements.

![Second Code Snippet](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/x1caaknubcv8q2xadc1k.png)

There are different ways to create an Object in JavaScript. For example, you could make an Object using an object initializer or create a constructor function and instantiate a new instance of that object. Object initializers are creating objects with literal notation. This is consistent with the terminology used by C++. ![Using object initializers](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/crhlhgogi98imie9xbk1.png) This is wildly different from creating an Object using a constructor function where we can create reusable and distinct instances of an object. To create this type of object, start with creating a function where the properties and methods are added to the `this` object.

![Using a constructor function](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/u760rwb4xn41zu5pfkyo.png)

You can then instantiate a new instance of that object with `new` and reuse it repeatedly.

![Instantiating dog objects](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/yauqftqzxbeg2gc1grpd.png)

This blog is inspired by one of our Twitter threads that we post on our Twitter account. There are many threads like this; you should [check them out](https://twitter.com/amplication).

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Crash Course on JavaScript Objects (LET&#39;S GO 🚀 )<br><br>Thread 🧵👇 <a href="https://t.co/aLGstx2NEj">pic.twitter.com/aLGstx2NEj</a></p>&mdash; Amplication (@amplication) <a href="https://twitter.com/amplication/status/1551869682256420866?ref_src=twsrc%5Etfw">July 26, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>