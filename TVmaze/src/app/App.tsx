import { useEffect, useState } from 'react';
import { getShows, searchShows } from '../features/catalog/service';
import type { TvmazeShow } from '../features/catalog/service';
import { ShowGrid } from '../features/catalog/components/ShowGrid';
import '../App.css';

function App() {
  const [shows, setShows] = useState<TvmazeShow[]>([]);
  const [searchResults, setSearchResults] = useState<TvmazeShow[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');

  const isSearchMode = query.trim().length >= 2;
  const visibleShows = isSearchMode ? searchResults : shows;

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
    if (searchTerm.length < 2) return;

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
    setSearching(value.trim().length >= 2);
    setError('');
    if (value.trim().length < 2) setSearchResults([]);
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
        <h2>{isSearchMode ? 'Résultats de recherche' : 'Toutes les séries'} ({visibleShows.length})</h2>
        {loading && <p className="notice">Chargement du catalogue…</p>}
        {error && <p className="notice error-notice" role="alert">{error}</p>}
        {!loading && !searching && !error && visibleShows.length === 0 && (
          <p className="notice">Aucune série ne correspond à votre recherche.</p>
        )}
        <ShowGrid shows={visibleShows} />
      </section>

      <footer className="footer">
        <span>Données fournies par <a href="https://www.tvmaze.com/" target="_blank" rel="noreferrer">TVmaze</a></span>
        <span>API TVmaze · Licence CC BY-SA</span>
      </footer>
    </main>
  );
}

export default App;
