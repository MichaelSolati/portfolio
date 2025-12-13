---
title: How 129KB of Whitespace (and a Recursive Loop) Broke the Web
description: A retrospective on the React2Shell vulnerability and the subsequent "Second Wave" of DoS and Leak flaws. We dissect the protocol failure, the "Denial of Wallet," and why you need to patch again.
tags: react, security, nextjs, node
pubDate: Fri Dec 12 2025 20:00:00 GMT-0800 (Pacific Standard Time)
hero: /blog/how-129kb-of-whitespace-and-a-recursive-loop-broke-the-web/hero.webp
---

It’s been about one week since the disclosure of **React2Shell (CVE-2025-55182)**. The initial "drop everything" panic has mostly subsided, and hopefully, your PagerDuty alerts have stopped screaming. Now that the smoke has cleared, we can actually take a breath and look at the wreckage to understand what just happened to the React ecosystem.

For me, the reality of the situation really hit home when I got **8** emails from GCP (Google Cloud). It wasn't the usual billing alert warning (the other type of email that causes panic). It looked like this:

> ### **New Advisory Notification**
>
> Dear Google Cloud customer,
>
> You've received an important Google Cloud notification affecting your resource...
>
> Notification Title: **Important Security Information Regarding React & Next.js Vulnerability (CVE-2025-55182)**

When your cloud provider starts sending out a bunch of "Advisory Notification" emails naming a JavaScript framework, you know it’s not just a bug; it’s [an event!](https://www.cve.org/CVERecord?id=CVE-2025-55182).

This wasn't just a bad week for Next.js developers; it was a wake-up call for the entire industry. So, with the benefit of hindsight, and some unfortunate new developments regarding a "Second Wave" of vulnerabilities; let's dissect exactly how a CVSS 10.0 vulnerability slipped into the default config of the world's most popular React framework.

## How We Got Here

To understand the exploit, you have to look at the architecture. For years, we pushed for a "seamless" integration between client and server. We wanted **React Server Components (RSC)** to fetch data directly on the backend and stream it to the frontend.

But here is the trade-off we don't talk about enough: **Trust Boundaries.**

In the old days (literally 12 months ago!), we mostly sent JSON back and forth. JSON is safe because it's dumb... It’s just data. But RSC needs to transport "execution context" (think Promises, Symbols, and Server Actions). JSON couldn't handle that, so React built the Flight protocol.

### The Fatal Flaw in Flight

The vulnerability lies in how the `react-server-dom-*` packages handle the Flight protocol. By design, Flight allows the server to deserialize complex objects sent by the client.

If you've studied security history, the word "deserialize" should make you flinch. [Java (Struts), PHP, and Python have all suffered catastrophic failures here](https://dev.to/cheetah100/lessons-from-react2shell-1m8b#violation-of-security-principles). React2Shell proved that JavaScript is not immune.

The vulnerability allowed an unauthenticated attacker to send a specially crafted HTTP request, specifically manipulating [Promise-like objects known as "thenables"](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise#thenables) to the server. React's internal logic would aggressively try to "resolve" this malicious object, allowing the attacker to [hijack the execution flow and run arbitrary code](https://securitylabs.datadoghq.com/articles/cve-2025-55182-react2shell-remote-code-execution-react-server-components/).

## The WAF Bypass (Why the Email Came Too Late)

One of the most annoying parts of this week was watching what we thought were our security defenses fail. We assumed our Web Application Firewalls (WAFs) would catch this. They didn't.

Attackers realized that most WAFs optimize for speed by only inspecting the first 8KB to 128KB of a request body.

So, the attackers used a stupid simple technique: **padding.**

They simply added ~129KB of "junk" data (whitespace, comments) to the beginning of their malicious payloads. The WAF would scan the junk, see nothing wrong, and pass the request to the Next.js server. The server, which *does* read the whole body, would then deserialize the payload and trigger the remote code execution.

## The Second Wave: It Wasn't Just RCE

And just as soon as you think you can pat yourself on the back for patching the RCE vulnerability, the security researchers (and the React team) found that the rabbit hole went deeper.

On December 11, we learned that the parser wasn't just vulnerable to code execution; it was fragile to structural abuse. This led to two new CVEs that you need to know about right now.

### 1. The Infinite Loop (CVE-2025-55184 & CVE-2025-67779)

The Flight protocol deserializer is recursive by nature, it has to be to resolve references within references. It turns out, if you send a payload where a chunk references itself in a specific loop, the Node.js process enters a synchronous infinite loop.

Because Node.js is single-threaded, this is catastrophic. [Your CPU spikes to 100%, and the server becomes instantly unresponsive to *all* users](https://vercel.com/kb/bulletin/security-bulletin-cve-2025-55184-and-cve-2025-55183).

In the serverless world (Vercel, AWS Lambda), this leads to what we call **"Denial of Wallet"**. An attacker can force your functions to run until they time out, spinning up thousands of maxed-out instances and racking up a massive bill for compute time you didn't actually use.

### 2. The Spy in the Reflection (CVE-2025-55183)

This one is a bit spookier. [It allows an attacker to trick the server into revealing its own source code](https://react.dev/blog/2025/12/11/denial-of-service-and-source-code-exposure-in-react-server-components).

If your Server Actions use `toString()` on arguments (or implicitly convert them), an attacker can pass a crafted reference object that serializes the internal state of the closure back to the client.

If you follow best practices and use environment variables (`process.env.DB_PASS`), you're mostly okay; the attacker sees the variable name, not the value. But if you hardcoded API keys or secrets directly into your code? Those are now public knowledge.

## The "Patch of the Patch"

Here is the frustrating part that caught a lot of us off guard.

When the DoS vulnerability was first found, React released version **19.0.2**. We all updated. We thought we were safe.

But researchers found a way to bypass *that* fix by adding a layer of indirection to the circular reference. This forced a *second* patch cycle. If you updated to fix the RCE but stopped there, you are still vulnerable to the DoS and Source Code Exposure flaws.

## Where We Go From Here

If you haven't patched in the last 24 hours, you are likely living on borrowed time. There is no configuration change that fully mitigates this vulnerability; upgrading dependencies is mandatory, and you need to be on the **final** safe versions.

**The Upgrade List:**

* **Next.js 15.x:** Update to **15.0.7+** (Do not stop at 15.0.6)
* **Next.js 14:** Update to **14.2.35+**
* **React:** Update to **19.0.3+** (for 19.0.x branch) or **19.1.4+**

**Crucial Step:** You must **rebuild** (`next build`) and **redeploy** your application. The vulnerable code is bundled into your server artifacts; a simple restart won't save you.

### The Hindsight Perspective

React2Shell and its "offspring" vulnerabilities are going to change the conversation around "Full Stack" frameworks. We traded strict separation of concerns for developer convenience, and we got burned.

Does this mean RSC is dead? No. But the days of assuming the server-side code in your Next.js app is "safe by default" are over. We need to treat our frontend-backend hybrids with the same security rigor we apply to backend-only services.

Time to patch up (**again**) and get back to building. Happy Friday!
