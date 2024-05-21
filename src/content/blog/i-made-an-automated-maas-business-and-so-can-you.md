---
title: I Made an Automated MaaS Business, and So Can You!
description: ""
pubDate: Mar 26 2019
hero: https://thepracticaldev.s3.amazonaws.com/i/ujz5avsrauk1unlrcxjt.gif
---

For the past 2 years, I've been joking with my friends and former coworkers about building a business around a simple idea: MaaS! For the past 6 months, I've been telling conference attendees that I was really, seriously really working on a MaaS product, hoping it would force me to follow through. It's been a long time coming, but I finally finished it, and it works!

Oh - what does MaaS stand for? It means Memes as a Service! You really know that you live in the 21st century when getting a meme is as easy as buying groceries.

My project is called Memeogram, and you can use it [RIGHT NOW](https://memeogram.com)! All you need to do is pick a friend, decide how many memes you want to send to them, and select how "dank" you want the memes to be. In about 2 weeks, they will receive the memes via mail.

Yes, I said via **mail**. Postcards, actually: the very way you would not expect a meme to arrive to you.

Here's how [Memeogram](https://memeogram.com) works under the hood: a sender fills out a [Typeform](https://www.typeform.com), where we collect all of the information needed to send the memes by mail. When the sender clicks Submit, a [Typeform webhook](https://www.typeform.com/help/webhooks/) sends the submission to a [Firebase Cloud Function](https://firebase.google.com/products/functions). The Cloud Function parses the order, finds the best memes for the job, and sends a request to [Lob](https://lob.com/) to print and mail the order, all while keeping the sender up-to-date via emails sent with [Mailgun](https://www.mailgun.com/).

I know, it's so fancy!

---

## Create Your Own MaaS Project in 4 Steps

### Step 1. Create a Typeform Form

If you want to build an application like [Memeogram](https://memeogram.com), start by creating a [Typeform](https://www.typeform.com) like this one:

![Filling a Typeform](https://thepracticaldev.s3.amazonaws.com/i/lmu9olwevkxxcihp60v7.gif)

To send a postcard with [Lob](https://lob.com/), you'll need to collect some information; primarily the names of the sender and recipient, as well as their mailing addresses, broken down into these fields:

- Street address
- City
- State
- Zip Code

Additional information like the sender's email address or a message to include on the postcard would be a nice touch, but it's not required to use Lob.

---

### Step 2. Use Firebase to Handle a Webhook

After you create your form, the next step is processing submissions. This [Firebase Cloud Function](https://firebase.google.com/products/functions) allows you to handle submissions and will serve as the endpoint that Typeform will send a POST request on form submission.

```typescript
import * as express from 'express';
import * as admin from 'firebase-admin';

// Our endpoint for handling the Typeform Webhook.
export const webhook = async (request: express.Request, response: express.Response) => {
  const submission = request.body;

  // This is our initial postcard, we will fill it out as we continue...
  const postcard = {
    sender: {},
    recipient: {}
  };

  // Here we parse out details from the form submission. By using an answers `ref` we map the response to in our postcard object.
  submission.form_response.answers.forEach((answer: any) => {
    const ref = answer['field']['ref'];
    switch (ref) {
      case 'sender-name':
        order['sender']['name'] = answer.text;
      case 'sender-email':
        order['sender']['email'] = answer.email;
      case 'recipient-name':
        order['recipient']['name'] = answer.text;
        break;
      default:
        break;
    }
  });
  
  // We will now save the postcard into a collection for our reference
  return admin.firestore().collection('orders').add(postcard)
    // We also will create a status document to keep a sender up to date on their order
    .then((ref) => admin.firestore().collection('status').doc(ref.id).set({
      lastUpdated: new Date(),
      message: 'Order to be sent to Lob',
      email: order.sender.email,
    }))
    .then(() => response.status(200).send({ success: true }));
}
```

Two important things happen here: you store the postcard in a collection of all `orders` (which will trigger a submission to Lob), and you store the status of the postcard order in a `status` collection (which will be used to trigger [Mailgun](https://www.mailgun.com/) status emails to the sender).

---

### Step 3. Send the Postcard With Lob

Firebase allows you to [trigger functions when a Firestore Collection is written to](https://firebase.google.com/docs/functions/firestore-events). When a new postcard is saved to a Firestore Collection, you can trigger [Lob](https://lob.com/) to print a postcard.

```typescript
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { readFileSync } from 'fs';
import { join } from 'path';

const Lob = require('lob')('<YOUR-LOB-API-KEY-HERE>');

// The front and the back of postcards being sent can be stored/created as HTML files, with variables swapped in by Lob
const POSTCARD_FRONT: string = readFileSync(join(__dirname, 'templates', 'front.html'), 'utf8');
const POSTCARD_BACK: string = readFileSync(join(__dirname, 'templates', 'back.html'), 'utf8');

// This function will be triggered whenever a new document is created in the `order` collection. So when the above `webhook` function resolves, this function is automatically triggered.
export const ordersOnCreate = functions.firestore.document('orders/{id}').onCreate((snapshot, context) => {
  const id = context.params.id;
  const postcard = snapshot.data();
  
  // Let's send the order to Lob for printing!
  return Lob.postcards.create({
    description: `Typeform 💌 Lob - ${id}`,
    to: {
      name: postcard.recipient.name,
      address_line1: postcard.recipient.address,
      address_line2: '',
      address_city: postcard.recipient.city,
      address_state: postcard.recipient.state,
      address_zip: postcard.recipient.zip
    },
    from: {
      name: postcard.sender.name,
      address_line1: postcard.sender.address,
      address_line2: '',
      address_city: postcard.sender.city,
      address_state: postcard.sender.state,
      address_zip: postcard.sender.zip
    },
    front: POSTCARD_FRONT,
    back: POSTCARD_BACK,
    merge_variables: {
      // This is a variable that will be swapped into out postcard HTML templates
      message: postcard.message
    }
  }, (error: any, success: any) => {
    if (error) {
      // If we are unable to send the order to Lob we will update our status with an error
      admin.firestore().collection('status').doc(id).update({
        error: true,
        message: 'Your order could not be sent to Lob',
        lastUpdated: new Date()
      });
    } else {
      // If successful we will update the order status accordingly
      admin.firestore().collection('status').doc(id).update({
        error: false,
        message: 'Your order has been successfully sent to Lob',
        completed: true,
        lastUpdated: new Date(),
        sent: success
      });
    }
  });
});
```

---

### Step 4. Notify the Sender with Mailgun

You may have noticed that the code in the previous two sections writes to the `status` collection. This is because you'll want to keep senders up-to-date on the status of their orders. Just like the Cloud Function that is triggered when an order is created, you will trigger this function to send [Mailgun](https://www.mailgun.com/) status emails when a status is created or updated.

```typescript
import * as functions from 'firebase-functions';
import * as Mailgun from 'mailgun-js';

const mailgun = Mailgun({
  apiKey: '<YOUR-MAILGUN-API-KEY-HERE>',
  domain: '<YOUR-MAILGUN-DOMAIN-HERE>'
});

// This function will be triggered whenever a status is created
export const statusOnCreate = functions.firestore.document('status/{statusId}').onCreate((snapshot, context) => {
  // First we parse out the ID of the status document (it should match the order's ID)
  const id = context.params.statusId;
  // Then we parse out the status document
  const status = snapshot.data();
  // We then send the status and id to our `sendEmail` function that will handle sending the email
  return sendEmail(status, id);
});

// This function will be triggered whenever a status is changed (updated)
export const statusOnUpdate = functions.firestore.document('status/{statusId}').onUpdate((change, context) => {
  // Here we just ensure it's an update and not a delete
  if (!change.after) { return Promise.resolve(); }
  const id = context.params.statusId;
  const status = change.after.data();
  return sendEmail(status, id);
});

// All we do here is send the email via Mailgun
function sendEmail(status: any, id: string): Promise<any> {
  return mailgun.messages().send({
    from: 'support@typeform.com',
    to: status.email,
    subject: `Typeform 💌 Lob - Order ${id} Update`,
    text: `${status.message} \n View order at https://typeform-lob.firebaseapp.com/order?id=${id}`
  });
}
```

---

## The End Product

After you deploy the project on Firebase, you can fill out your form and watch the process run until you get a confirmation email you can use to track the order.

![A confirmed order](https://thepracticaldev.s3.amazonaws.com/i/tfjhnz2lbjlco9tph6pq.png)

Try it yourself! This guide will walk you through the entire process of setting up and deploying the application I described above:

```bash
git clone https://github.com/MichaelSolati/typeform-lob.git
cd typeform-lob
npm i
npm run start
```

Or you can try a deployed version of the demo app [right here](https://lob.typeformdev.com).

While memes can be fun, other practical use cases that may exist is if you wanted to automate thank you cards being sent out to customers who purchase your product. Or perhaps a platform to [contact ones local congress person via mail](https://resist.bot/).

---

To keep up with everything I’m doing, follow me on [Twitter](https://twitter.com/MichaelSolati). If you’re thinking, _“Show me the code!”_ you can find me on [GitHub](https://github.com/MichaelSolati).
