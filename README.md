# Portfolio Website

A modern, responsive portfolio website built with Next.js, TypeScript, and Tailwind CSS. This portfolio showcases work, blog posts, code projects, and speaking engagements with automatic updates and minimal maintenance.

This repo is designed for lazy developers all over the world. With little configuration and maintanince let this application automatically update itself without you having to lift a finger!

## ✨ Features

- **Modern Tech Stack**: Next.js 15, TypeScript, and Tailwind CSS
- **Responsive Design**: Mobile-first approach with smooth animations
- **Dark/Light Mode**: Built-in theme switching
- **Blog System**: Markdown-based blog with syntax highlighting
- **Code Showcase**: Dedicated section for highlighting your best code
- **Video Section**: Showcase speaking engagements and presentations
- **SEO Optimized**: Built-in metadata generation
- **Static Export**: Optimized for deployment to any static hosting service
- **View Transitions**: Smooth page transitions for enhanced UX
- **Firebase Integration**: Analytics and hosting ready
- **AI Summarizer**: Summarize blog posts and code snippets with AI

## 🚀 Quick Start

### Prerequisites

- Node.js 22+
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/MichaelSolati/portfolio.git
   cd portfolio
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:9002](http://localhost:9002)

## 📁 Project Structure

```text
├── public/                   # Static assets
└── src/
    ├── app/                  # Next.js App Router pages
    │   ├── about/            # About page
    │   ├── blog/             # Blog listing and posts
    │   ├── code/             # Code showcase section
    │   ├── rss.xml/          # RSS feed
    │   ├── videos/           # Video/speaking section
    │   ├── layout.tsx        # Root layout
    │   └── page.tsx          # Homepage
    ├── components/           # Reusable components
    │   ├── layout/           # Layout components
    │   └── ui/               # UI components
    ├── config/               # Configuration files
    │   └── site.ts           # Site configuration, handles, nav, etc.
    ├── content/              # Content files
    │   └── blog/             # Markdown blog posts
    ├── data/                 # Data files
    │   └── bio.json          # Professional & education background
    ├── hooks/                # Custom React hooks
    └── lib/                  # Utility functions
```

## ⚙️ Configuration

### Site Configuration

Edit `src/config/site.ts` to customize your portfolio:

```typescript
export const siteConfig = {
  name: "Your Name",
  url: "https://yoursite.com",
  description: "Your professional description",
  handles: {
    github: "your-github-username",
    twitter: "your-twitter-handle",
    linkedin: "your-linkedin-profile",
    youtubePlaylistId: "your-youtube-playlist-id",
  },
  nav: {
    // Navigation configuration
  },
};
```

## ✍️ Blog Posts

Create markdown files in `src/content/blog/` with frontmatter:

```markdown
---
title: "Your Blog Post Title"
description: "Brief description"
pubDate: June 30 2025
hero: /blog/your-post-slug/hero.jpg
---

Your content here...
```

## 🚀 Deployment

### Static Export

This project is configured for static export:

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

### Firebase Hosting

The project includes Firebase configuration for easy deployment. You will need to update the `.firebaserc` file with your own Firebase project configuration. Run the following command to build and deploy to Firebase:

```bash
firebase deploy
```

### Environment Variables

Create a `.env` file with. You can copy the `.env.example` file and fill in the values.

```bash
cp .env.example .env
```

Then fill in the values.

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
YOUTUBE_API_KEY=your_youtube_api_key_here
```

## 📝 Available Scripts

- `npm run dev` - Start development server (port 9002)
- `npm run build` - Build for production (static export)
- `npm run lint` - Run linting
- `npm run fix` - Fix linting issues

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Content**: Markdown with remark/rehype
- **Themes**: next-themes
- **Analytics**: Firebase
- **Hosting**: Firebase Hosting ready

## 📄 License

This project is open source and available under the [MIT License](LICENSE.md).
