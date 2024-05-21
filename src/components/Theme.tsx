import {environment} from '../environment';

export default function Theme() {
  const {theme} = environment;

  return (
    <>
      <meta
        name="theme-color"
        media="(prefers-color-scheme: light)"
        content={theme.light.primary}
      />

      <meta
        name="theme-color"
        media="(prefers-color-scheme: dark)"
        content={theme.dark.primary}
      />

      <style>
        {`
     :root {
      --mdc-theme-background: ${theme.light.background};
      --mdc-theme-primary: ${theme.light.primary};
      --mdc-theme-on-primary: ${theme.light.onPrimary};
      --mdc-theme-secondary: ${theme.light.secondary};
      --mdc-theme-on-secondary: ${theme.light.onSecondary};
      --mdc-theme-surface: ${theme.light.surface};
      --mdc-theme-on-surface: ${theme.light.onSurface};
      --link: ${theme.light.link};
    }
  
    @media (prefers-color-scheme: dark) {
      :root {
        --mdc-theme-background: ${theme.dark.background};
        --mdc-theme-primary: ${theme.dark.primary};
        --mdc-theme-on-primary: ${theme.dark.onPrimary};
        --mdc-theme-secondary: ${theme.dark.secondary};
        --mdc-theme-on-secondary: ${theme.dark.onSecondary};
        --mdc-theme-surface: ${theme.dark.surface};
        --mdc-theme-on-surface: ${theme.dark.onSurface};
        --link: ${theme.dark.link};
      }
    }
    `}
      </style>
    </>
  );
}
