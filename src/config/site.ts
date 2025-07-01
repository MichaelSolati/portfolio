export type NavItem = {
  title: string;
  icon: string;
  description: string;
};

export type NavDict = Record<string, NavItem>;

export const siteConfig = {
  name: 'Michael Solati',
  url: 'https://michaelsolati.com',
  description:
    "I'm an experienced software developer with 9+ years in full stack development and expertise in leveraging web capabilities to deliver scalable software solutions.",
  handles: {
    github: 'MichaelSolati',
    twitter: 'MichaelSolati',
    linkedin: 'MichaelSolati',
    youtubePlaylistId: 'PLpvTYOL2L1kRkGfvnMk96sQ-iDKkzxrUl',
  },
  nav: {
    '/': {
      title: 'Home',
      icon: 'Home',
      description:
        "I'm an experienced software developer with 9+ years in full stack development and expertise in leveraging web capabilities to deliver scalable software solutions.",
    },
    '/about': {
      title: 'About',
      icon: 'User',
      description: 'A little bit about me, my work, and my education.',
    },
    '/blog': {
      title: 'Blog',
      icon: 'BookText',
      description: 'Stories, guides, and tutorials for developers by me.',
    },
    '/code': {
      title: 'Code',
      icon: 'Code',
      description:
        "Some of the best code I've written, available for everyone!",
    },
    '/videos': {
      title: 'Videos',
      icon: 'Video',
      description:
        "From major conferences to smaller meetups, I've spoken at a slew of events.",
    },
  },
  githubUsername: 'MichaelSolati',
};
