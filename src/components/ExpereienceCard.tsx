import Markdown from 'react-markdown';

export type Props = {
  description: string | undefined;
  end: Date | null;
  filter: string;
  start: Date;
  subtitle: string;
  title: string;
};

export default function ExpereienceCard({description, subtitle, title}: Props) {
  return (
    <div className="col-xs-12 col-sm-6 col-lg-4">
      <div className="mdc-card">
        <div className="mdc-card-wrapper__text-section">
          <h2 className="mdc-typography--headline6">{title}</h2>
          <h3 className="mdc-typography--subtitle1">{subtitle}</h3>
        </div>

        <div className="mdc-card__content">
          <Markdown className="mdc-typography--subtitle1">
            {description}
          </Markdown>
        </div>
      </div>
    </div>
  );
}
