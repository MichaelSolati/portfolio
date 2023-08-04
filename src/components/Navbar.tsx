import "../styles/components/Navbar.scss";
import { environment } from "../environment";

export default function Navbar() {
  return (
    <header className="mdc-top-app-bar">
      <div className="mdc-top-app-bar__row">
        <section className="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
          <a className="mdc-top-app-bar__title" href="/">
            {environment.name}
          </a>
        </section>
        <section
          className="mdc-top-app-bar__section mdc-top-app-bar__section--align-end"
          role="toolbar"
        >
          <a className="mdc-top-app-bar__action-item mdc-button" href="/blog">
            <span className="mdc-button__ripple"></span>
            <span className="mdc-button__label">{environment.blog.title}</span>
          </a>
          {environment.github && (
            <a className="mdc-top-app-bar__action-item mdc-button" href="/code">
              <span className="mdc-button__ripple"></span>
              <span className="mdc-button__label">
                {environment.github.title}
              </span>
            </a>
          )}
          {environment.youtubePlaylist && (
            <a
              className="mdc-top-app-bar__action-item mdc-button"
              href="/videos"
            >
              <span className="mdc-button__ripple"></span>
              <span className="mdc-button__label">
                {environment.youtubePlaylist.title}
              </span>
            </a>
          )}
        </section>
      </div>
    </header>
  );
}
