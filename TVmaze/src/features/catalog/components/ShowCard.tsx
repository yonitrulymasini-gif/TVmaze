import type { TvmazeShow } from '../service';

type ShowCardProps = {
  show: TvmazeShow;
};

export function ShowCard({ show }: ShowCardProps) {
  return (
    <article className="show-card">
      <div className="poster-frame">
        {show.image?.medium
          ? <img className="poster" src={show.image.medium} alt={`Affiche de ${show.name}`} loading="lazy" />
          : <span className="poster poster-placeholder">{show.name}</span>}
      </div>
      <div className="card-info">
        <p className="show-title">{show.name}</p>
        <p className="card-meta">
          {show.premiered?.slice(0, 4) ?? 'Date inconnue'}
          {show.rating.average !== null && <><span>·</span> ★ {show.rating.average.toFixed(1)}</>}
        </p>
        <div className="genre-list">
          {show.genres.slice(0, 2).map((item) => <span className="genre-chip" key={item}>{item}</span>)}
        </div>
      </div>
    </article>
  );
}
