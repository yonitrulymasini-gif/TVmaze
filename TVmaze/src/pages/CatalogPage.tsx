import { useMemo } from 'react';
import type { TvmazeShow } from '../features/catalog/service';
import { ShowGrid } from '../features/catalog/components/ShowGrid';

const SHOWS_PER_PAGE = 20;

type CatalogPageProps = {
  shows: TvmazeShow[];
  isSearchMode: boolean;
  query: string;
  searching: boolean;
  genre: string;
  availableGenres: string[];
  pageIndex: number;
  loading: boolean;
  error: string;
  isInMyList: (show: TvmazeShow) => boolean;
  onQueryChange: (value: string) => void;
  onGenreChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onSelectShow: (show: TvmazeShow) => void;
  onToggleMyList: (show: TvmazeShow) => void;
};

export function CatalogPage({
  shows,
  isSearchMode,
  query,
  searching,
  genre,
  availableGenres,
  pageIndex,
  loading,
  error,
  isInMyList,
  onQueryChange,
  onGenreChange,
  onPageChange,
  onSelectShow,
  onToggleMyList,
}: CatalogPageProps) {
  const filteredShows = useMemo(
    () => shows.filter((show) => !genre || show.genres.includes(genre)),
    [shows, genre],
  );
  const pageCount = Math.ceil(filteredShows.length / SHOWS_PER_PAGE);
  const currentPage = Math.min(pageIndex, Math.max(0, pageCount - 1));
  const pageShows = filteredShows.slice(
    currentPage * SHOWS_PER_PAGE,
    (currentPage + 1) * SHOWS_PER_PAGE,
  );

  function changePage(page: number) {
    onPageChange(page);
    document.getElementById('all-shows')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <section className="catalog catalog-page" id="all-shows">
      <h2>{isSearchMode ? 'Résultats de recherche' : 'Toutes les séries'} ({filteredShows.length})</h2>

      <div className="filters">
        <label className="search-box">
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Rechercher une série…"
            aria-label="Rechercher une série"
          />
          {searching && <span className="search-status">Recherche…</span>}
        </label>
        <select
          className="genre-select"
          value={genre}
          onChange={(event) => onGenreChange(event.target.value)}
          aria-label="Filtrer par genre"
        >
          <option value="">Tous les genres</option>
          {availableGenres.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      </div>

      {loading && <p className="notice">Chargement du catalogue…</p>}
      {error && <p className="notice error-notice" role="alert">{error}</p>}
      {!loading && !searching && !error && filteredShows.length === 0 && (
        <p className="notice">
          {genre ? `Aucune série « ${genre} » ici.` : 'Aucune série ne correspond à votre recherche.'}
        </p>
      )}

      <ShowGrid
        shows={pageShows}
        isInMyList={isInMyList}
        onSelectShow={onSelectShow}
        onToggleMyList={onToggleMyList}
      />

      {pageCount > 1 && (
        <nav className="pagination" aria-label="Pagination">
          <button
            className="page-button"
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 0}
          >
            ← Précédent
          </button>

          <div className="page-numbers">
            {Array.from({ length: pageCount }, (_, index) => (
              <button
                key={index}
                className={index === currentPage ? 'page-number active' : 'page-number'}
                onClick={() => changePage(index)}
                aria-current={index === currentPage ? 'page' : undefined}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <button
            className="page-button"
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage >= pageCount - 1}
          >
            Suivant →
          </button>
        </nav>
      )}
    </section>
  );
}
