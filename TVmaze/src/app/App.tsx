import { useEffect, useMemo, useState } from 'react';
import { getShow, getShows, searchShows } from '../features/catalog/service';
import type { TvmazeShow } from '../features/catalog/service';
import { ShowDetailsModal } from '../features/catalog/components/ShowDetailsModal';
import { useMyList } from '../features/catalog/hooks/useMyList';
import { CatalogPage } from '../pages/CatalogPage';
import { HomePage } from '../pages/HomePage';
import '../App.css';

const MIN_SEARCH_LENGTH = 3;

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'catalog'>('home');
  const [shows, setShows] = useState<TvmazeShow[]>([]);
  const [searchResults, setSearchResults] = useState<TvmazeShow[]>([]);
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState('');
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');
  const [selectedShow, setSelectedShow] = useState<TvmazeShow | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');
  const [pageIndex, setPageIndex] = useState(0);
  const { myList, isInMyList, toggleMyList } = useMyList();

  const isSearchMode = query.trim().length >= MIN_SEARCH_LENGTH;
  const visibleShows = isSearchMode ? searchResults : shows;
  const availableGenres = useMemo(
    () => [...new Set(shows.flatMap((show) => show.genres))].sort((a, b) => a.localeCompare(b, 'fr')),
    [shows],
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

  function changeGenre(value: string) {
    setGenre(value);
    setPageIndex(0);
  }

  function goTo(view: 'home' | 'catalog') {
    setCurrentView(view);
    window.scrollTo({ top: 0 });
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
        <button className="brand" onClick={() => goTo('home')} aria-label="TVmaze, accueil">
          <span className="brand-mark">TV</span>
          <span>maze</span>
        </button>
        <nav className="main-nav" aria-label="Navigation principale">
          <button
            className={currentView === 'home' ? 'main-nav-link active' : 'main-nav-link'}
            onClick={() => goTo('home')}
          >
            Accueil
          </button>
          <button
            className={currentView === 'catalog' ? 'main-nav-link active' : 'main-nav-link'}
            onClick={() => goTo('catalog')}
          >
            Catalogue
          </button>
        </nav>
      </header>

      {currentView === 'home' ? (
        <HomePage
          featuredShows={shows.slice(0, 10)}
          myList={myList}
          loading={loading}
          error={error}
          isInMyList={isInMyList}
          onOpenCatalog={() => goTo('catalog')}
          onSelectShow={openShow}
          onToggleMyList={toggleMyList}
        />
      ) : (
        <CatalogPage
          shows={visibleShows}
          isSearchMode={isSearchMode}
          query={query}
          searching={searching}
          genre={genre}
          availableGenres={availableGenres}
          pageIndex={pageIndex}
          loading={loading}
          error={error}
          isInMyList={isInMyList}
          onQueryChange={changeQuery}
          onGenreChange={changeGenre}
          onPageChange={setPageIndex}
          onSelectShow={openShow}
          onToggleMyList={toggleMyList}
        />
      )}

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
