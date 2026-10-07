import { useEffect, useState } from 'react';
import { getShow, getShows, searchShows } from '../features/catalog/service';
import type { TvmazeShow } from '../features/catalog/service';
import { ShowDetailsModal } from '../features/catalog/components/ShowDetailsModal';
import { ShowGrid } from '../features/catalog/components/ShowGrid';
import { useMyList } from '../features/catalog/hooks/useMyList';
import '../App.css';

function App() {
  const [shows, setShows] = useState<TvmazeShow[]>([]);
  const [searchResults, setSearchResults] = useState<TvmazeShow[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');
  const [selectedShow, setSelectedShow] = useState<TvmazeShow | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');
  const [pageIndex, setPageIndex] = useState(0);
  const { myList, isInMyList, toggleMyList } = useMyList();
  const MIN_SEARCH_LENGTH = 3;
  const SHOWS_PER_PAGE = 20;
  const isSearchMode = query.trim().length >= MIN_SEARCH_LENGTH;
  const visibleShows = isSearchMode ? searchResults : shows;
  const pageCount = Math.ceil(visibleShows.length / SHOWS_PER_PAGE);
  const pageShows = visibleShows.slice(
    pageIndex * SHOWS_PER_PAGE,
    (pageIndex + 1) * SHOWS_PER_PAGE,
  );

  useEffect(() => {
    getShows()
      .then(setShows)
      .catch((cause: unknown) => {
        setError(cause instanceof Error ? cause.message : 'Impossible de charger les séries.');
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const searchTerm = query.trim();
    if (searchTerm.length < MIN_SEARCH_LENGTH) return;

    let isCurrentSearch = true;
    const timeout = window.setTimeout(() => {
      searchShows(searchTerm)
        .then((results) => {
          if (isCurrentSearch) setSearchResults(results);
        })
        .catch((cause: unknown) => {
          if (isCurrentSearch) {
            setError(cause instanceof Error ? cause.message : 'La recherche a échoué.');
          }
        })
        .finally(() => {
          if (isCurrentSearch) setSearching(false);
        });
    }, 350);

    return () => {
      isCurrentSearch = false;
      window.clearTimeout(timeout);
    };
  }, [query]);

  function changeQuery(value: string) {
    setQuery(value);
    setPageIndex(0);
    setSearching(value.trim().length >= MIN_SEARCH_LENGTH);
    setError('');
    if (value.trim().length < MIN_SEARCH_LENGTH) setSearchResults([]);
  }

  function changePage(page: number) {
    setPageIndex(page);
    document.getElementById('all-shows')?.scrollIntoView({ behavior: 'smooth' });
  }

  async function openShow(show: TvmazeShow) {
    setSelectedShow(show);
    setDetailLoading(true);
    setDetailError('');
    try {
      setSelectedShow(await getShow(show.id));
    } catch (cause) {
      setDetailError(cause instanceof Error ? cause.message : 'Impossible de charger les épisodes.');
    } finally {
      setDetailLoading(false);
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">TV</span>
          <span>maze</span>
        </div>
      </header>

      <section className="home-hero">
        <h1>Explorez l’univers des séries.</h1>
        <p className="intro-copy">Découvrez des séries, retrouvez leurs épisodes et gardez vos préférées à portée de main.</p>
        <label className="search-box">
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            value={query}
            onChange={(event) => changeQuery(event.target.value)}
            placeholder="Rechercher une série…"
            aria-label="Rechercher une série"
          />
          {searching && <span className="search-status">Recherche…</span>}
        </label>
      </section>

      <section className="catalog">
        <h2>Ma liste ({myList.length})</h2>
        {myList.length === 0 ? (
          <p className="notice">Votre liste est vide. Cliquez sur ♡ sur une série pour l’ajouter.</p>
        ) : (
          <ShowGrid
            shows={myList}
            isInMyList={isInMyList}
            onSelectShow={openShow}
            onToggleMyList={toggleMyList}
          />
        )}
      </section>

      <section className="catalog" id="all-shows">
        <h2>{isSearchMode ? 'Résultats de recherche' : 'Toutes les séries'} ({visibleShows.length})</h2>
        {loading && <p className="notice">Chargement du catalogue…</p>}
        {error && <p className="notice error-notice" role="alert">{error}</p>}
        {!loading && !searching && !error && visibleShows.length === 0 && (
          <p className="notice">Aucune série ne correspond à votre recherche.</p>
        )}
        <ShowGrid
          shows={pageShows}
          isInMyList={isInMyList}
          onSelectShow={openShow}
          onToggleMyList={toggleMyList}
        />

        {pageCount > 1 && (
          <nav className="pagination" aria-label="Pagination">
            <button
              className="page-button"
              onClick={() => changePage(pageIndex - 1)}
              disabled={pageIndex === 0}
            >
              ← Précédent
            </button>

            <div className="page-numbers">
              {Array.from({ length: pageCount }, (_, index) => (
                <button
                  key={index}
                  className={index === pageIndex ? 'page-number active' : 'page-number'}
                  onClick={() => changePage(index)}
                  aria-current={index === pageIndex ? 'page' : undefined}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <button
              className="page-button"
              onClick={() => changePage(pageIndex + 1)}
              disabled={pageIndex >= pageCount - 1}
            >
              Suivant →
            </button>
          </nav>
        )}
      </section>

      <footer className="footer">
        <span>Données fournies par <a href="https://www.tvmaze.com/" target="_blank" rel="noreferrer">TVmaze</a></span>
        <span>API TVmaze · Licence CC BY-SA</span>
      </footer>

      {selectedShow && (
        <ShowDetailsModal
          show={selectedShow}
          loading={detailLoading}
          error={detailError}
          isInMyList={isInMyList(selectedShow)}
          onToggleMyList={toggleMyList}
          onClose={() => setSelectedShow(null)}
        />
      )}
    </main>
  );
}

export default App;
