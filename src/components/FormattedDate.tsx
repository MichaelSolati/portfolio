type Props = {
  date: Date;
};

export default function FormattedDate({date}: Props) {
  return (
    <time datetime={date.toISOString()}>
      {date.toLocaleDateString('en-us', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })}
    </time>
  );
}
