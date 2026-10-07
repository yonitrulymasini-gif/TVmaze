import type { TvmazeShow } from '../service';
import { ShowCard } from './ShowCard';

type ShowGridProps = {
  shows: TvmazeShow[];
  isInMyList: (show: TvmazeShow) => boolean;
  onSelectShow: (show: TvmazeShow) => void;
  onToggleMyList: (show: TvmazeShow) => void;
};

export function ShowGrid({ shows, isInMyList, onSelectShow, onToggleMyList }: ShowGridProps) {
  return (
    <div className="show-grid">
      {shows.map((show) => (
        <ShowCard
          key={show.id}
          show={show}
          isInMyList={isInMyList(show)}
          onSelect={onSelectShow}
          onToggleMyList={onToggleMyList}
        />
      ))}
    </div>
  );
}
