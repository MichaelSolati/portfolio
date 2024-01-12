import Card from "./Card";
import type { Props as CardProps } from "./Card";

export type Props = {
  elements: CardProps[];
};

export default function Cards({ elements }: Props) {
  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        {elements.map((element) => (
          <Card {...element} key={element.url} />
        ))}
      </div>
    </div>
  );
}
