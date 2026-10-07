import type { TvmazeShow } from '../service';
import { ShowCard } from './ShowCard';

type ShowGridProps = {
  shows: TvmazeShow[];
  onSelectShow: (show: TvmazeShow) => void;
};

export function ShowGrid({ shows, onSelectShow }: ShowGridProps) {
  return (
    <div className="show-grid">
      {shows.map((show) => (
        <ShowCard key={show.id} show={show} onSelect={onSelectShow} />
      ))}
    </div>
  );
}
