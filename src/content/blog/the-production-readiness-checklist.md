---
title: The Production Readiness Checklist
description: The USPS site asked me to 'Install Create React App Sample.' 🤦‍♂️ It's a hilarious reminder that the last 5% of polish is the product. Here's a production readiness checklist to fix this.
pubDate: Tue Nov 13 2025 9:30:00 GMT-0800 (Pacific Standard Time)
hero: /blog/the-production-readiness-checklist/hero.webp
---

I was tracking a package on the official USPS website on my phone this morning. Like many modern sites, it's a Progressive Web App (PWA). A small prompt appeared at the top of the screen asking if I wanted to install the app. I didn't tap "Install," but I did see something that caused a double-take.

The confirmation prompt didn't say "Install USPS Tracking."

It said: **"Install Create React App Sample."**

<figure>
  <img src="/blog/the-production-readiness-checklist/usps-screenshot.webp" alt="A mobile screenshot of the USPS tracking page showing package status updates, overlaid with an unexpected 'Install Create React App Sample' browser prompt at the top of the screen.">
  <figcaption style="margin-left: auto; margin-right: auto; width: fit-content;">When my government tells me to "Install Create React App Sample" I "Install Create React App Sample"</figcaption>
</figure>

I had to laugh. The official United States Postal Service website, a critical piece of infrastructure used by millions, was prompting me to install a default placeholder.

My first thought wasn't, "Oh, some developer is in trouble." My first thought was, *"That's a process failure."*

This isn't about blaming a single person who forgot to update a manifest.json file. This is a sign of a gap in the deployment process. It's a classic case of focusing so hard on the core features (the tracking logic) that we forget the "last 5%," the polish.

But here's the secret: to a user, that "last 5%" is the product. It's the first thing they see and the main thing that builds or breaks their trust. How can you trust a site with your package details if it still has the default boilerplate text?

This is why every team needs a "Production Readiness Checklist."

## The Production Readiness Checklist

This isn't some 100-page document nobody reads. It's a set of automated guards and manual sign-offs that protect your team's professionalism. Here's what I recommend for every project.

### 1. The "Chrome" is Correct

I'm going to call this stuff the "chrome," it's the frame around your application. It's **everything but the features**, and it's the first thing a user sees.

- **`manifest.json`:** Are the `short_name` and `name` correct? Are the icons pointing to the right, non-default assets? (This is what the USPS missed.)
- **`index.html`:** Is the `<title>` tag correct? Is the `<meta name="description">` meaningful?
- **Favicons:** Do you have them? Are they loading? Don't be the broken image icon or the default React/Angular/Vue logo in the browser tab.
- **Error Pages:** Are your 404 Not Found and 500 Server Error pages branded? Or do they just show a default Nginx or server error that scares your users?

### 2. Automate Your Professionalism (The CI Gate)

This is the most important part. **Humans forget. Computers don't.**

Your CI/CD pipeline (e.g., GitHub Actions, GitLab CI, Jenkins) shouldn't just run unit tests; it should serve as your quality gatekeeper. This is something I've championed on my teams. We add various tests to our CI/CD pipeline that run before any deployment.

For this situation, you can do this with a simple `grep` command. Here's a simple "fail-if-found" shell script you can tinker with and add to your pipeline today:

```bash
#!/bin/bash

# Define placeholder strings to check for
# Add your own framework's defaults!
PLACEHOLDERS=(
  "Create React App Sample"
  "React App"
  "lorem ipsum"
  "TODO"
  "FIXME"
  "powered by"
)

# Files to check in your build output
FILES_TO_CHECK="dist/index.html dist/manifest.json"

echo "Checking for placeholder text in production files..."

for file in $FILES_TO_CHECK; do
  if [ ! -f "$file" ]; then
    echo "ℹ️ Skipping check for non-existent file: $file"
    continue
  fi

  for placeholder in "${PLACEHOLDERS[@]}"; do
    # Use grep to search for the placeholder
    # -i: case-insensitive
    # -q: quiet mode, just returns exit status
    if grep -i -q "$placeholder" "$file"; then
      echo "❌ ERROR: Found placeholder text '$placeholder' in '$file'."
      echo "Deployment aborted. Please remove all placeholder text."
      exit 1
    fi
  done
done

echo "✅ No placeholder text found. Good to go!"
exit 0
```

This tiny script, added to your deployment process, just saved you from a world of embarrassment. You're now treating your configuration as code, which is a key DevOps principle.

Don't be the dev with [concepts of a plan](https://www.youtube.com/watch?v=oPk8d1jA34k&t=8s), ADD TESTS!

### 3. Review the "Scaffolding"

When we review pull requests, we're often trained to look at the `*.ts` or `*.js` files, the logic. We skim right past the 'scaffolding' files like `index.html`, and the various JSON or YAML files.

This needs to change. It's a mistake I still make, but these config files are part of the PR and deserve the same level of rigor. Ask in your PR reviews: "Did we update the title? Did we check the manifest?"

## The "Last 5%" is 100% of Your Reputation

Back when I was a Developer Advocate (🥑), I worked a lot with PWAs and building sample apps. I would use tools like Firebase Hosting to get them up and to the public quickly and easily. But that simplicity can be a trap! It's so easy to run `firebase deploy` that you can forget to check the `manifest.json` that your framework scaffolding (like the Angular CLI) generated for you.

Using your CI pipeline (say, GitHub Actions) to deploy to your hosting provider and adding a linting step is the perfect way to combine ease of use with professional-grade quality.

Look, everyone ships bugs. Even massive organizations like the USPS. It's not about being perfect; it's about building robust systems that catch our simple, human mistakes.

These little details (the "chrome"), like your PWA name, the favicon, aren't "nice-to-haves." They are your digital storefront. They're the first impression you make, and they're critical for building the user trust that your application depends on.

So, my challenge to you is: go look at your app's `manifest.json` or `index.html` in your `main` branch. Right now. You might be surprised at what you find.

What's the most embarrassing placeholder you've ever seen slip into production?
