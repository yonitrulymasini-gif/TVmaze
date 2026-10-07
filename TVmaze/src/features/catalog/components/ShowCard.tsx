import type { TvmazeShow } from '../service';

type ShowCardProps = {
  show: TvmazeShow;
  isInMyList: boolean;
  onSelect: (show: TvmazeShow) => void;
  onToggleMyList: (show: TvmazeShow) => void;
};

export function ShowCard({ show, isInMyList, onSelect, onToggleMyList }: ShowCardProps) {
  return (
    <article className="show-card">
      <button className="poster-button" onClick={() => onSelect(show)} aria-label={`Voir ${show.name}`}>
        {show.image?.medium
          ? <img className="poster" src={show.image.medium} alt={`Affiche de ${show.name}`} loading="lazy" />
          : <span className="poster poster-placeholder">{show.name}</span>}
        <span className="poster-overlay">Voir la série <span aria-hidden="true">↗</span></span>
      </button>
      <button
        className={isInMyList ? 'card-heart selected' : 'card-heart'}
        onClick={() => onToggleMyList(show)}
        aria-label={isInMyList ? `Retirer ${show.name} de ma liste` : `Ajouter ${show.name} à ma liste`}
        aria-pressed={isInMyList}
      >
        {isInMyList ? '♥' : '♡'}
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
