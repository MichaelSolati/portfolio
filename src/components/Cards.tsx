import Card from './Card';
import type {Props as CardProps} from './Card';

export type Props = {
  elements: CardProps[];
};

export default function Cards({elements}: Props) {
  return (
    <div className="container is-fluid">
      <div className="row justify-content-center">
        {elements.map((element, i) => (
          <Card key={i} {...element} />
        ))}
      </div>
    </div>
  );
}
