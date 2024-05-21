import {useEffect, useRef, useState} from 'react';
import {MDCMenu} from '@material/menu';

import ExpereienceCard from './ExpereienceCard';
import type {Props as ExpereienceCardProps} from './ExpereienceCard';

type Props = {
  elements: ExpereienceCardProps[];
};

const options = [
  {title: 'All', icon: 'list'},
  {title: 'Work', icon: 'business'},
  {title: 'Education', icon: 'school'},
  {title: 'Volunteer', icon: 'group'},
];

export default function ExperienceCards({elements}: Props) {
  const menuButtonRef = useRef(null);
  const menuRef = useRef(null);
  const [filteredElements, setFilteredElements] = useState(elements);
  const [filteredTitle, setFilteredTitle] = useState(options[0].title);

  const filterPosts = (key: string) => {
    setFilteredTitle(key);
    setFilteredElements(
      elements.filter(
        element => key === 'All' || element.filter === key.toLowerCase()
      )
    );
  };

  useEffect(() => {
    const menuButton = menuButtonRef.current;
    const menuEl = menuRef.current;
    const menu = new MDCMenu(menuEl);

    menuButton.addEventListener('click', () => {
      menu.open = !menu.open;
    });

    return () => {
      menuButton.removeEventListener('click', () => {
        menu.open = !menu.open;
      });
    };
  }, []);

  return (
    <>
      <section className="mdc-app-bar mdc-top-app-bar">
        <div className="mdc-top-app-bar__row">
          <section className="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
            <span className="mdc-top-app-bar__title" id="experiences-title">
              {filteredTitle} Experiences
            </span>
          </section>
          <section
            className="mdc-top-app-bar__section mdc-top-app-bar__section--align-end"
            role="toolbar"
          >
            <div
              ref={menuRef}
              className="mdc-menu mdc-menu-surface mdc-menu-surface--anchor"
            >
              <ul
                className="mdc-list"
                role="menu"
                aria-hidden="true"
                aria-orientation="vertical"
                tabIndex={-1}
              >
                {options.map(opt => (
                  <li
                    className="mdc-list-item"
                    role="menuitem"
                    onClick={() => filterPosts(opt.title)}
                    key={opt.title}
                  >
                    <span className="mdc-list-item__ripple"></span>
                    <i
                      className="material-icons mdc-button__icon"
                      aria-hidden="true"
                    >
                      {opt.icon}
                    </i>
                    <span className="mdc-list-item__text">{opt.title}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button
              className="mdc-button"
              ref={menuButtonRef}
              aria-label="Open experience filter"
            >
              <span className="mdc-button__ripple"></span>
              <i className="material-icons mdc-button__icon" aria-hidden="true">
                filter_list
              </i>
            </button>
          </section>
        </div>
      </section>
      <div className="container is-fluid">
        <div className="row justify-content-center" id="experiences-cards">
          {filteredElements.map((element, i) => (
            <ExpereienceCard key={i} {...element} />
          ))}
        </div>
      </div>
    </>
  );
}
