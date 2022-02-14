if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  const manifest = document.head.querySelector('link[rel=manifest]');
  manifest?.setAttribute('href', '/manifest.dark.json');
}
