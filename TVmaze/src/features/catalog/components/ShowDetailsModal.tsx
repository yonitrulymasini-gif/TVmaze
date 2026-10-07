import { useEffect } from 'react';
import type { TvmazeShow } from '../service';
import { plainText } from '../utils';

type ShowDetailsModalProps = {
  show: TvmazeShow;
  loading: boolean;
  error: string;
  onClose: () => void;
};

export function ShowDetailsModal({ show, loading, error, onClose }: ShowDetailsModalProps) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section
        className="show-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Fermer">×</button>
        <div className="detail-header">
          {show.image?.original && <img className="detail-poster" src={show.image.original} alt="" />}
          <div className="detail-copy">
            <p className="eyebrow">FICHE SÉRIE</p>
            <h2 id="detail-title">{show.name}</h2>
            <p className="detail-meta">
              {[show.premiered?.slice(0, 4), show.network?.name ?? show.webChannel?.name, show.status]
                .filter(Boolean)
                .join(' · ')}
            </p>
            <div className="genre-list">
              {show.genres.map((item) => <span className="genre-chip" key={item}>{item}</span>)}
            </div>
            {plainText(show.summary) && <p className="summary">{plainText(show.summary)}</p>}
          </div>
        </div>

        <div className="episodes-section">
          <h3>Épisodes</h3>
          {loading && <p className="notice">Chargement des épisodes…</p>}
          {error && <p className="notice error-notice" role="alert">{error}</p>}
          {!loading && !error && (show._embedded?.episodes?.length ?? 0) === 0 && (
            <p className="notice">Aucun épisode disponible.</p>
          )}
          <ol className="episode-list">
            {show._embedded?.episodes?.map((episode) => (
              <li className="episode" key={episode.id}>
                <span className="episode-number">
                  S{String(episode.season).padStart(2, '0')} · E{String(episode.number ?? 0).padStart(2, '0')}
                </span>
                <div>
                  <strong>{episode.name}</strong>
                  <p>{episode.airdate || 'Date inconnue'}{episode.runtime ? ` · ${episode.runtime} min` : ''}</p>
                  {plainText(episode.summary) && <p className="episode-summary">{plainText(episode.summary)}</p>}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
