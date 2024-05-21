export type Props = {
  button?: string;
  description: string;
  hero?: string;
  title: string;
  url: string;
};

const limitDescription = (description: string | null) => {
  return description && description.length > 240
    ? `${description.substring(0, 237)}...`
    : description;
};

export default function Card({
  button = 'View',
  description,
  hero,
  title,
  url,
}: Props) {
  return (
    <div className="col-xs-12 col-sm-6 col-lg-4">
      <div className="mdc-card">
        {hero && (
          <img
            className="mdc-card__media mdc-card__media--16-9"
            src={hero}
            alt={title}
            height="230"
            width="410"
            loading="lazy"
          />
        )}

        <div className="mdc-card-wrapper__text-section">
          <h2 className="mdc-typography--headline6">{title}</h2>
        </div>

        <div className="mdc-card__content">
          <p className="mdc-typography--subtitle1">
            {limitDescription(description)}
          </p>
        </div>

        <div className="mdc-card__actions">
          <a
            className="mdc-button mdc-card__action mdc-card__action--button"
            href={url}
            target={url.startsWith('http') ? '_blank' : undefined}
            rel={url.startsWith('http') ? 'noopener noreferrer' : undefined}
          >
            <span className="mdc-button__ripple" />
            <span className="mdc-button__label">{button}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
