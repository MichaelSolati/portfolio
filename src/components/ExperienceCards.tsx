import { MDCMenu } from "@material/menu";

import ExpereienceCard from "./ExpereienceCard";
import type { Props as ExpereienceCardProps } from "./ExpereienceCard";

type Props = {
  elements: ExpereienceCardProps[];
};

const options = [
  { title: "All", icon: "list" },
  { title: "Work", icon: "business" },
  { title: "Education", icon: "school" },
  { title: "Volunteer", icon: "group" },
];

export default function ExperienceCards({ elements }: Props) {
  return (
    <>
      <section className="mdc-app-bar mdc-top-app-bar">
        <div className="mdc-top-app-bar__row">
          <section className="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
            <span className="mdc-top-app-bar__title" id="experiences-title">
              All Experiences
            </span>
          </section>
          <section
            className="mdc-top-app-bar__section mdc-top-app-bar__section--align-end"
            role="toolbar"
          >
            <div className="mdc-menu mdc-menu-surface mdc-menu-surface--anchor">
              <ul
                className="mdc-list"
                role="menu"
                aria-hidden="true"
                aria-orientation="vertical"
                tabIndex={-1}
              >
                {options.map((opt) => (
                  <li className="mdc-list-item" role="menuitem" key={opt.title}>
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
              id="open-menu"
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
          {elements.map((element, i) => (
            <ExpereienceCard key={i} {...element} />
          ))}
        </div>
      </div>
    </>
  );
}
