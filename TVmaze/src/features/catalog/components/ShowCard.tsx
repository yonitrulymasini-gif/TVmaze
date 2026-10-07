import type { TvmazeShow } from '../service';

type ShowCardProps = {
  show: TvmazeShow;
  onSelect: (show: TvmazeShow) => void;
};

export function ShowCard({ show, onSelect }: ShowCardProps) {
  return (
    <article className="show-card">
      <button className="poster-button" onClick={() => onSelect(show)} aria-label={`Voir ${show.name}`}>
        {show.image?.medium
          ? <img className="poster" src={show.image.medium} alt={`Affiche de ${show.name}`} loading="lazy" />
          : <span className="poster poster-placeholder">{show.name}</span>}
        <span className="poster-overlay">Voir la série <span aria-hidden="true">↗</span></span>
      </button>
      <div className="card-info">
        <button className="show-title" onClick={() => onSelect(show)}>{show.name}</button>
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
