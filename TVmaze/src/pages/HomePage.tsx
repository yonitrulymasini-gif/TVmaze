import type { TvmazeShow } from '../features/catalog/service';
import { ShowGrid } from '../features/catalog/components/ShowGrid';

type HomePageProps = {
  featuredShows: TvmazeShow[];
  myList: TvmazeShow[];
  loading: boolean;
  error: string;
  isInMyList: (show: TvmazeShow) => boolean;
  onOpenCatalog: () => void;
  onSelectShow: (show: TvmazeShow) => void;
  onToggleMyList: (show: TvmazeShow) => void;
};

export function HomePage({
  featuredShows,
  myList,
  loading,
  error,
  isInMyList,
  onOpenCatalog,
  onSelectShow,
  onToggleMyList,
}: HomePageProps) {
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
        <h2>Ma liste ({myList.length})</h2>
        {myList.length === 0 ? (
          <p className="notice">Votre liste est vide. Cliquez sur ♡ sur une série pour l’ajouter.</p>
        ) : (
          <ShowGrid
            shows={myList}
            isInMyList={isInMyList}
            onSelectShow={onSelectShow}
            onToggleMyList={onToggleMyList}
          />
        )}
      </section>

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
