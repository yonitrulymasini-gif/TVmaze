import { useState } from 'react';
import type { TvmazeShow } from '../features/catalog/service';
import { ShowCard } from '../features/catalog/components/ShowCard';
import { ShowGrid } from '../features/catalog/components/ShowGrid';

type HomePageProps = {
  featuredShows: TvmazeShow[];
  topRatedShows: TvmazeShow[];
  myList: TvmazeShow[];
  loading: boolean;
  error: string;
  isInMyList: (show: TvmazeShow) => boolean;
  onOpenCatalog: () => void;
  onSelectShow: (show: TvmazeShow) => void;
  onToggleMyList: (show: TvmazeShow) => void;
};

const MY_LIST_PREVIEW = 5;

export function HomePage({
  featuredShows,
  topRatedShows,
  myList,
  loading,
  error,
  isInMyList,
  onOpenCatalog,
  onSelectShow,
  onToggleMyList,
}: HomePageProps) {
  const [showAllMyList, setShowAllMyList] = useState(false);
  const visibleMyList = showAllMyList ? myList : myList.slice(0, MY_LIST_PREVIEW);

  return (
    <>
      <section className="home-hero">
        <h1>Explorez l’univers des séries.</h1>
        <p className="intro-copy">Découvrez des séries, retrouvez leurs épisodes et gardez vos préférées à portée de main.</p>
        <button className="primary-action" onClick={onOpenCatalog}>
          Explorer le catalogue <span aria-hidden="true">→</span>
        </button>
      </section>

      <section className="catalog">
        <div className="section-heading">
          <h2>Ma liste ({myList.length})</h2>
          {myList.length > MY_LIST_PREVIEW && (
            <button className="text-action" onClick={() => setShowAllMyList(!showAllMyList)}>
              {showAllMyList ? 'Réduire ↑' : 'Tout afficher ↓'}
            </button>
          )}
        </div>
        {myList.length === 0 ? (
          <p className="notice">Votre liste est vide. Cliquez sur ♡ sur une série pour l’ajouter.</p>
        ) : (
          <ShowGrid
            shows={visibleMyList}
            isInMyList={isInMyList}
            onSelectShow={onSelectShow}
            onToggleMyList={onToggleMyList}
          />
        )}
      </section>

      {topRatedShows.length > 0 && (
        <section className="catalog">
          <h2>Le Top 3</h2>
          <div className="top-rated-grid">
            {topRatedShows.map((show, index) => (
              <div className="top-rated-item" key={show.id}>
                <div className="top-rated-heading">
                  <span className="rank-badge">#{index + 1}</span>
                  <span className="top-rated-score">★ {show.rating.average?.toFixed(1)} / 10</span>
                </div>
                <ShowCard
                  show={show}
                  isInMyList={isInMyList(show)}
                  onSelect={onSelectShow}
                  onToggleMyList={onToggleMyList}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="catalog">
        <div className="section-heading">
          <h2>Séries à découvrir</h2>
          <button className="text-action" onClick={onOpenCatalog}>
            Tout le catalogue <span aria-hidden="true">→</span>
          </button>
        </div>
        {loading && <p className="notice">Chargement du catalogue…</p>}
        {error && <p className="notice error-notice" role="alert">{error}</p>}
        <ShowGrid
          shows={featuredShows}
          isInMyList={isInMyList}
          onSelectShow={onSelectShow}
          onToggleMyList={onToggleMyList}
        />
      </section>
    </>
  );
}
