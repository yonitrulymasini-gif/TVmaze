import { useEffect, useState } from 'react';
import { getShows } from '../features/catalog/service';
import type { TvmazeShow } from '../features/catalog/service';
import '../App.css';

function App() {
  const [shows, setShows] = useState<TvmazeShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getShows()
      .then(setShows)
      .catch((cause: unknown) => {
        setError(cause instanceof Error ? cause.message : 'Impossible de charger les séries.');
      })
      .finally(() => setLoading(false));
  }, []);

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
        <p className="intro-copy">Le site est en construction, étape par étape.</p>
      </section>

      <section className="catalog">
        <h2>Toutes les séries ({shows.length})</h2>
        {loading && <p className="notice">Chargement du catalogue…</p>}
        {error && <p className="notice error-notice" role="alert">{error}</p>}
        <ul>
          {shows.map((show) => (
            <li key={show.id}>{show.name}</li>
          ))}
        </ul>
      </section>

      <footer className="footer">
        <span>Données fournies par <a href="https://www.tvmaze.com/" target="_blank" rel="noreferrer">TVmaze</a></span>
        <span>API TVmaze · Licence CC BY-SA</span>
      </footer>
    </main>
  );
}

export default App;
