---
title: Code Your Way to Seals
description: Build your Seal of the Day website with machine-generated code! Utilize Amplication and Copilot to create a stunning seal showcase. Amplication generates the backend server with NestJS, while Copilot writes code to fetch seal pictures.
pubDate: May 23 2023
hero: https://static-assets.amplication.com/blog/code-your-way-to-seals/hero.png
canonical: https://amplication.com/blog/code-your-way-to-seals
---

One of my favorite Instagram accounts is [sealotd](https://www.instagram.com/sealotd/) (Seal of the Day). Getting a cute pinniped every day is one of the few things that gets me out of bed in the morning, as well as helping developers build compelling experiences with [Amplication](https://amplication.com/) (obviously).

All kidding aside, the premise of seeing a new seal every day got me thinking about how I could create a website that does this for me. But, unfortunately, I only have a little free time and need help finishing this quickly. That's when I remembered the [power of machine-generated code](https://dev.to/amplication/how-machine-assisted-code-generation-is-revolutionizing-the-development-process-h85) and decided that if I wanted to build this quickly, it'd be best to use Amplication and [GitHub Copilot](https://github.com/features/copilot).

So read on to learn how I built my own Seal of the Day without writing any code!*

*Exaggerated for dramatic effect.

## My Tools

Keeping it straightforward, I'll be using Amplication and Github Copilot.

Amplication is a developer-focused tool that allows you to quickly generate an extensible backend that includes everything out of the box for you. This is awesome as I'll use the NestJS server that Amplication generates for me to host the home page that showcases all of those picturesque pinnipeds and store those seals in a database so I can query them on the fly.

But the server is just the base. I need to get those four finned water dogs, and using Copilot, I'm confident I can get their pictures from the web by asking Copilot to write that code for me. Copilot is an AI-powered code generation tool that utilizes machine learning to provide developers with suggestions and auto-complete code while they write. It uses ML models to give developers code suggestions. With Copilot, I can tell it what I want to create, and it'll write any code I need to customize the Amplication-generated server!

## Creating My Seal Service With Amplication

The first thing I need to do is create my backend server. I did that by navigating to [app.amplication.com](https://app.amplication.com/login) and signing in with my GitHub. I then created a new project called "Seal of the Day."

<div>
  <img src="https://static-assets.amplication.com/blog/code-your-way-to-seals/0.png"
    alt="Creating a new project with Amplication"
    width="2256" height="1503"
    loading="lazy"
    style="margin-left: auto; margin-right: auto;">
</div>
<br />

With a project to house my service, it's time to add a service resource. I called mine "Seal Service," and as I was walked through the [service creation wizard](https://amplication.com/blog/introducing-amplications-service-wizard), I selected the following options:

- I connected it to a new GitHub repo to sync my code.
- I disabled the GraphQL and REST APIs.
- I chose Polyrepo to simplify the structure of my git repository.
- I went with PostgreSQL for my database.
- I created an empty project; no templates are needed here.
- I skipped authentication.

That was it for a large part of the Amplication process. However, the Seal Service needs to be able to store my seals, so in my service's entities, I'll add a new entity called "Seal."  Entities are best described as the data object your database will store. So when you create an entity, you're defining an object type, the properties it'll have, and the data types of those properties. You can think of it as declaring a table schema in SQL.

To the Seal entity, I added three fields: "Date," "Image," and "Caption." Amplication sets "Date" to be a "Data Time" data type, which is absolutely correct and less work for us to do. "Image" and "Caption" are set to be of the "Single Line Text" data type, which is also correct.

<div>
  <img src="https://static-assets.amplication.com/blog/code-your-way-to-seals/1.png"
    alt="Adding the Seal entity to my service"
    width="2256" height="1503"
    loading="lazy"
    style="margin-left: auto; margin-right: auto;">
</div>
<br />

Now we've done all the work we'll need in Amplication. To run my code locally, I'll need to sync it to GitHub and then clone it locally. Assuming you're comfortable with git commands, such as git clone, check out the Amplication docs site to learn how to [sync your code to GitHub](https://docs.amplication.com/sync-with-github/).

### Wasn't That Easy

If you think building that backend with Amplication was super easy, that's because it was! At Amplication, we're making the premier backend generation tool for individual developers, enterprises, and pinnipeds.

If you like our work, you can help us by [giving us a 🌟on Github](https://github.com/amplication/amplication)! We're close to 10,000 stars (9.9k as of posting this) and need your help. I promise it'll be better than having a sea dog barking at you...

<div>
  <img src="https://static-assets.amplication.com/blog/code-your-way-to-seals/bark.gif"
    alt="Sea dog barking"
    width="275" height="329"
    loading="lazy"
    style="margin-left: auto; margin-right: auto;">
</div>
<br />

## Customizing My Seal Service

Now it's time to sealify my service. And this is where Copilot will really begin to shine. If you want to follow along, install Copilot into your IDE and enable it in your GitHub account. Thankfully, GitHub provides a quick start guide to [set it up locally](https://docs.github.com/en/copilot/getting-started-with-github-copilot).

### Creating The Home Page

From now on, all of my work will occur in the `server` directory of the repo I cloned from GitHub. Inside the `src` folder, I added a folder called `views`; inside that, I created a file called `index.hbs`. This [Handlebars](https://handlebarsjs.com/) file will serve as the template for showing the daily seals. I didn't feel like writing the template, so I asked Copilot for help. I wrote the following comment into the file, then clicked ctrl + enter to see what Copilot suggested.

```hbs
<!-- Generate a full HTML page with an image in the body and a caption -->
```

<div>
  <img src="https://static-assets.amplication.com/blog/code-your-way-to-seals/2.png"
    alt="Copilot's suggestions for the page"
    width="2256" height="1503"
    loading="lazy"
    style="margin-left: auto; margin-right: auto;">
</div>
<br />

The first option was close to what I wanted, so I modified it slightly to the following.

```hbs
<!doctype html>
<html>
  <head>
    <title>Image Caption Generator</title>
  </head>
  <body>
    <img src="{{image}}" />
    <p>{{caption}}</p>
  </body>
</html>
```

Now for the NestJS controller that will serve the page. I added the file `home.controller.ts` in the `src` directory. I next added the following comment as a prompt for Copilot.

```ts
// NestJS controller that returns a HTML page with an image element and a caption when a user visits the root path of the server.
```

<div>
  <img src="https://static-assets.amplication.com/blog/code-your-way-to-seals/3.png"
    alt="Copilot's suggestions for the controller"
    width="2256" height="1503"
    loading="lazy"
    style="margin-left: auto; margin-right: auto;">
</div>
<br />

One of the suggestions was close, so I modified it to the following.

```ts
// NestJS controller that returns a HTML page with an image element and a caption when a user visits the root path of the server.
import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class HomeController {
  @Get()
  @Render('index.hbs')
  root() {
    return {
      caption: 'Hello Seal!',
      image: 'https://files.worldwildlife.org/wwfcmsprod/images/HERO_harbor_seal_on_ice/hero_full/87it51b9jx_Harbor_Seal_on_Ice_close_0357_6_11_07.jpg',
    };
  }
}
```

To get this to work, I now had to hook up the controller to my main application. I did this by adding the `HomeController` to the `controllers` array of the `AppModules`'s class decorator. The `AppModule` is found in `src/app.module.ts`. So, while that sounds fancy, it looks like this.

<div>
  <img src="https://static-assets.amplication.com/blog/code-your-way-to-seals/4.png"
    alt="Adding the HomeController to the AppModule"
    width="1205" height="376"
    loading="lazy"
    style="margin-left: auto; margin-right: auto;">
</div>
<br />

Also, I removed all references to `GraphQLModule` in the `AppModule`'s file. This is because I won't use it, and it may cause issues later.

Now I need to configure NestJS to process Handlebars templates. I'll first need to install the Handlebars plugin `hbs`.

```console
npm install hbs
```

Then I jumped into the `src/main.ts` file and updated where all my paths' global prefix is set to the following.

```diff
- app.setGlobalPrefix("api");
+ app.setGlobalPrefix("api", {exclude: [{ path: '', method: RequestMethod.GET }]});
```

Since Amplication prefixes all traditional routes with "api" I need to remove it from the home path, so users don't need to go to `/api` to see that seal.

Next is the actual configuration of the Handlebars renderer. The `hbs` library was actually built for Express. Thankfully NestJS is built on top of Express, and it's easy to modify my Nest application to parse and render the Handlebars files.

```diff
- const app = await NestFactory.create(AppModule, { cors: true });
+ const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: true });

+ app.setBaseViewsDir(path.join(__dirname, '..', 'src', 'views'));
+ app.setViewEngine('hbs');
```

Amplication also generates self-documenting APIs using tools like Swagger. Unfortunately, Swagger places its API exploration page at basically the home route, causing a conflict with our code. Thankfully I don't need it, so I removed it.

```diff
- const document = SwaggerModule.createDocument(app, swaggerDocumentOptions);

- /** check if there is Public decorator for each path (action) and its method (findMany / findOne) on each controller */
- Object.values((document as OpenAPIObject).paths).forEach((path: any) => {
-   Object.values(path).forEach((method: any) => {
-     if (
-       Array.isArray(method.security) &&
-       method.security.includes("isPublic")
-     ) {
-       method.security = [];
-     }
-   });
- });

- SwaggerModule.setup(swaggerPath, app, document, swaggerSetupOptions);
```

Running the server, I got the following when navigating to localhost:3000.

<div>
  <img src="https://static-assets.amplication.com/blog/code-your-way-to-seals/5.png"
    alt="A seals for everyday!"
    width="2256" height="1503"
    loading="lazy"
    style="margin-left: auto; margin-right: auto;">
</div>
<br />

### Displaying Seals From Flickr

So far, my project has been showing me one seal. Ideally, I'd get a different seal every day, but I want to avoid hardcoding a library of seals, so instead, I'll use [Flickr](https://www.flickr.com/) to fetch my seals for me. The issue is I have no experience using Flickr's APIs; thankfully, Copilot does.

I'll use the `SealService` in `src/seal/seal.service.ts` to get my web page the seals it needs to display. In the `SealService`, I added the following comment below the `SealService` and let Copilot get the work.

```ts
/**
 * Fetch a picture of a seal a walrus or a sea lion from flickr
 */
```

<div>
  <img src="https://static-assets.amplication.com/blog/code-your-way-to-seals/6.png"
    alt="Copilot writing code to get a seal picture from Flickr"
    width="2256" height="1503"
    loading="lazy"
    style="margin-left: auto; margin-right: auto;">
</div>
<br />

After a bit of modification, here's what I got.

```ts
/**
 * Fetch a picture of a seal a walrus or a sea lion from flickr
 */
async function fetchPictureOfSeal(): Promise<{image: string, caption: string}> {
  const response = await fetch('https://api.flickr.com/services/feeds/photos_public.gne?tags=seal,walrus,sea-lion&tagmode=all&format=json&nojsoncallback=true');
  const body = await response.json();
  const i = Math.floor(Math.random() * body.items.length);

  return { image: body.items[i].media.m, caption: body.items[i].title };
}
```

I added a `getSeal` method to the `SealService` that calls and returns the `fetchPictureOfSeal` Copilot wrote.

```diff
@Injectable()
export class SealService extends SealServiceBase {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

+   getSeal() {
+     return fetchPictureOfSeal();
+   }
}
```

Back in my `HomeController`, I added a constructor, injected the `SealService` into it, and updated the `root` method to return the `getSeal` method from the service so it can be rendered by the Handlebars template.

```ts
// NestJS controller that returns a HTML page with an image element and a caption when a user visits the root path of the server.
import { Controller, Get, Render } from '@nestjs/common';
import { SealService } from './seal/seal.service';

@Controller()
export class HomeController {
  constructor(private seal: SealService) {}

  @Get()
  @Render('index.hbs')
  async root() {
    return this.seal.getSeal();
  }
}
```

Running the server, I got the following when navigating to localhost:3000.

<div>
  <img src="https://static-assets.amplication.com/blog/code-your-way-to-seals/7.png"
    alt="Dynamic seals from Flickr"
    width="2256" height="1503"
    loading="lazy"
    style="margin-left: auto; margin-right: auto;">
</div>
<br />

The only issue left to resolve is that every time a user reloads the page, they'll get a different seal. I'll fix that in the next step.

### Storing and Fetching Seals

Amplication generated a PostgreSQL database and made it available to our Seal Service with Prisma. In fact, the `SealService` that we added the `getSeal` method to is an abstraction to the Prisma client, and we can use it to save a seal for the day and fetch it for subsequent visits on the same day. So let's dive into it!

Now this is where it will be easier to write code rather than depend on Copilot, but I'll still use it to assist me with some mundane bits I usually wouldn't want to write.

I will need to update the `getSeal` method to fetch the seal of the day from my database, but querying dates can be a little complex. The easiest way to handle querying dates is to store the day's date as midnight of that day (12:00 AM) and always query for midnight of the current day. So, for example, with the following prompt, Copilot can write a function in the `src/seal/seal.service.ts` file to give me the current date at midnight.

```ts
/**
 * Creates a date object for today but sets the time to be exactly 00:00:00
 */
```

<div>
  <img src="https://static-assets.amplication.com/blog/code-your-way-to-seals/8.png"
    alt="Copilot date generation functions"
    width="2256" height="1503"
    loading="lazy"
    style="margin-left: auto; margin-right: auto;">
</div>
<br />

Here's the function I opted to accept.

```ts
/**
 * Creates a date object for today but sets the time to be exactly 00:00:00
 */
function getToday(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}
```

With everything in place, it was time to rewrite the `getSeal` function. In effect, I wanted it to query my database to see if any seals for today's date existed. If they did, I would return it to the home page for rendering; if not, I would get a seal from Flickr, save that into my database for future queries, and then return that seal to the home page for rendering. So I wrote the following code to handle that for me.

```ts
async getSeal() {
  // Calculate today's date at midnight
  const today = getToday();
  // Query the database for seals with today's date
  const seals = await this.findMany({where: {date: today}});
  // Get the first seal with today's date
  const seal = seals.shift();

  // If the seal exists, return it
  if (seal) {
    return seal;
  } else {
    // If the seal doesn't exist get it from flickr, save it to the database, and return it
    const flickrSeal = await fetchPictureOfSeal();
    return this.create({data: {date: today, ...flickrSeal}});
  }
}
```

With this logic, users will get the same seal whenever they visit the page that day!

## Wrapping Up

Copilot, Amplication, and about 15 lines of code I wrote allowed me to generate a fully realized backend server that can server-side render a web page showing a different seal daily! In addition, I used the Flickr API, which I had no experience with before, and I felt confident and comfortable with the project I created.

If you have yet to try Amplication or Copilot, try them out. On the Amplication side of things, we have some [fantastic guides on our blog](https://amplication.com/tags/tutorials) that I'd suggest you check out.

If you like our work, be sure to [give us a 🌟 on GitHub](https://github.com/amplication/amplication) and [join our Discord community](https://discord.com/invite/KSJCZ24vj2) to chat with other Amplication developers.

Finally, the source code for this project is [available on GitHub](https://github.com/amplication/blog-sample-projects/tree/main/seal-of-the-day).
