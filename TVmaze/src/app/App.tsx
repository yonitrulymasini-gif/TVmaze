import '../App.css';

function App() {
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

      <footer className="footer">
        <span>Données fournies par <a href="https://www.tvmaze.com/" target="_blank" rel="noreferrer">TVmaze</a></span>
        <span>API TVmaze · Licence CC BY-SA</span>
      </footer>
    </main>
  );
}

export default App;
