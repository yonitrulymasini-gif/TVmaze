import type { TvmazeShow } from '../service';
import { ShowCard } from './ShowCard';

type ShowGridProps = {
  shows: TvmazeShow[];
};

export function ShowGrid({ shows }: ShowGridProps) {
  return (
    <div className="show-grid">
      {shows.map((show) => (
        <ShowCard key={show.id} show={show} />
      ))}
    </div>
  );
}
