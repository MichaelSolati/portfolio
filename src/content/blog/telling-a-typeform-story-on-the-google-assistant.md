---
title: Telling a Typeform story on the Google Assistant
description: How I told a spooky story on the Google Assistant using Typeform.
pubDate: Nov 19 2018
hero: https://thepracticaldev.s3.amazonaws.com/i/rz50ev9lgrgmyko70qg3.png
---

I grew up in the 90s, reading the gripping and petrifying narratives authored by the infamous R. L. Stine. My favorite novels were those where the readers were advised to beware and choose their own scare. These were pick-your-own adventure books, where readers jumped from page to page as they navigated through odd, eerie, and often chilling worlds.

Back then, it was easy to see and understand how these books worked. Years later, as a software developer, I think of them as simple decision trees, a rudimentary form of Artificial Intelligence. Even if not intended to be a form of AI, we as developers often tinker with these concepts in our `if` statements, and `switch` cases, where functions may chain to other functions based on cases, situations, or flags.

Code doesn't always tell a compelling story, though. My nephew and niece probably have no interest in writing classes or functions. I could likely inspire them to write their own spooky stories. That's where [Typeform](https://www.typeform.com/) can come in.

If you haven't heard of Typeform before, you've likely seen their product on the web. Typeform is a simple, yet powerful, tool for building forms for collecting and sharing information in a conversational manner. It is web-based, so you can create anything from surveys to apps without needing to write a single line of code. You can also use Typeform's APIs to dynamically and programmatically develop forms. Because these are conversational forms, Typeform has been used to make things like:

- [Job application forms](https://www.typeform.com/forms/job-application-form-template/)
- [Online order forms](https://www.typeform.com/order-forms/delivery-order-form-template/)
- [Quizzes & tests](https://www.typeform.com/quizzes/online-trivia-quiz-template/)
- [Contests](https://www.typeform.com/examples/polls/straw-poll-template/)
- [Registration forms](https://www.typeform.com/forms/registration-form-template/)
- [Interactive storytelling](https://www.typeform.com/templates/t/interactive-fiction/)

An interesting use is that the platform makes it super easy to make interactive stories! Effectively you make every field a multiple choice block where you tell part of your story as a chapter and present options to the reader. You can even use "Thank You Screens" (a PRO feature that is free to use) as ends of story branches.

![Building a form](https://thepracticaldev.s3.amazonaws.com/i/xlfilhz1un16kk0dkno9.png)

Once your chapters and endings are all created, you then need to connect them, and this is where, again, Typeform makes it super easy! Typeform's Logic Jumps (another PRO feature) allows users to see and interact with only parts of the form based on their selection.

![Jump to page 24](https://thepracticaldev.s3.amazonaws.com/i/ru7r483hto88qa3mhztl.gif)

Continuing this process you can build out cases for any scenario, and eventually build out a story like this one…

![A full story](https://thepracticaldev.s3.amazonaws.com/i/as4wod87qht3pfbu2vbr.png)

Yikes, that's an intense story! I have to admit, I didn't create it. It's actually the [Interactive Story Template](https://www.typeform.com/templates/t/interactive-fiction/) provided by Typeform. It provides for a great example of how to use Typeform to make an interactive story.

After my niece and nephew finish composing their very own horror story, such as the esteemed *Beware of the Purple Peanut Butter*, the developer in me asks, "what else can we do here?" While this may be cool, it would be even cooler to be able to TALK through the story. It is a conversational form after all!

To be able to talk through a story, we could make it playable on a Google Assistant enabled device, like the Google Home (which my nephew loves to talk to). Four tools can be used to do this: Dialogflow, Firebase, the Google Assistant, and Typeform! We use Dialogflow to handle intents or inputs from users, but we only use the default welcome intent for the intro to our story and the fallback intent for every future interaction. We fulfill these intents via webhook calls to cloud functions that can be hosted on Firebase. A lot of articles exist on the web that explain how to build a basic application for the Google Assistant. I advise you to look at some of them, or possibly take a look at codelabs that [Google provides here](https://developers.google.com/actions/codelabs/).

The real meat (or tofu) and potatoes of our interactive, voice-driven story comes from the Typeform SDK. [Typeform provides APIs and SDKs](https://developers.typeform.com/) for building and managing forms, fetching submissions,  and more. All we're really interested in here is their Create API, which we can use to retrieve the form. Just install the client via NPM:

```bash
npm i @typeform/api-client
```

From there, in your `index.js` file, we will add the Typeform client, instantiate it, and then get the form.

```javascript
import { createClient } from '@typeform/api-client';
import { dialogflow } from 'actions-on-google';
import * as functions from 'firebase-functions';

// Available at https://admin.typeform.com/account#/section/tokens
const typeform = createClient({ token: 'YOURTYPEFORMTOKEN'});

// The 6 character code in the URL when editing a form
const typeformForm = typeform.forms.get({ uid: 'FORMID' });
```

Once we have the form as a Promise, we will get the form data and set it as a local variable, that way we don't need to make another API request from Typeform each time we need to look through it.

```javascript
let resolvedForm;
typeformForm.then(f => resolvedForm = f);
```

Finally, now that we have the form data, we can create our handler for the Dialogflow webhooks, and we'll start with the default intent.

```javascript
const app = dialogflow();
app.intent('Default Welcome Intent', (conv) => {
  const slide = new Slide(conv, resolvedForm);
  slide.run();
});
export const aog = functions.https.onRequest(app);
```

You may notice that I inject the conversation as well as the form into a new instance of the Slide class. The Slide class was something I created to process the user input from Dialogflow as well as the details from the form.

When a user first speaks to the application, we grab the details of the first form field and send that back to the user with options on what they can do.

```javascript
conv.add(`Welcome to ${tf.title}. ${tf.welcome_screens[0].title}`);
conv.add(`${tf.fields[0].title}... What would you like to do? ${choices()}`);
conv.data = data();
```

That gets recited to the user. But what is also sent back, which remains hidden, is details about the options they have and which field the options take a user. That's where the `conv.data` gets assigned to the result of a call to the `data` function.

```javascript
function data() {
  const choices = field.properties.choices.map((c) => { return { label: c.label, ref: c.ref }; });
  const actions = tf.logic.find((v) => v.ref === field.ref).actions;
  const options = [];
  choices.forEach((c) => {
      const action = actions.find(a => ((a.condition.vars.length === 2) && (a.condition.vars[1].value === c.ref)));
      options.push({ label: c.label, value: action.details.to.value });
  });
  return { ref: field.ref, options };
}
```

We cycle through the choices of the current field the user is presented with and then search through the logic (a field returned via the SDK). We do this so we can see what field a choice will send a user to next (aka, jump to page 24). Then, finally, we return the data of the field the user is currently on, their options, and the fields their options go to.

With that information assigned to the `conv.data` when the user makes their next choice, we can determine if their choice was valid, and what the next field should be. Then it's rinse, cycle, repeat as the user makes their way through the gripping tale.

If you want to see what that's like, just find a Google Home (or use your Android phone) and say, "Ok Google, talk to *A Dreadful Start*."

The experience is completely built on Typeform. You can find all of the [code available here](https://github.com/MichaelSolati/aog-and-typeform). It's also available for you to try on your Assistant powered devices, you can send it to any of your devices [from here](https://assistant.google.com/services/a/uid/0000001b7df4bf67?hl=en).

I hope to hear your spooky stories soon!
