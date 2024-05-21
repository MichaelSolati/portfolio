import FormattedDate from './FormattedDate';

export type Props = {
  hero?: string;
  pubDate?: Date;
  title: string;
};

export default function Hero({hero, pubDate, title}: Props) {
  return (
    <div className="hero-banner">
      {hero && (
        <img
          className="hero-image"
          src={hero}
          width="1200"
          height="400"
          alt={title}
        />
      )}

      <div className="hero-content">
        <h1 className="mdc-typography--headline3">{title}</h1>
        {pubDate && (
          <div className="mdc-typography--caption">
            Published: <FormattedDate date={pubDate} />
          </div>
        )}
      </div>
    </div>
  );
}
