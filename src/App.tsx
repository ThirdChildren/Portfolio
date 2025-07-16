import React, { useEffect, useState } from "react";

// Interfaccia per un progetto
interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string; // URL immagine su IPFS
  projectUrl: string; // URL progetto su IPFS
}

// Componente card per ogni progetto
const ProjectCard: React.FC<{ project: Project }> = ({ project }) => (
  <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700 group transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
    <div className="relative">
      <img
        src={project.imageUrl}
        alt={project.title}
        className="w-full h-56 object-cover group-hover:brightness-90 transition duration-300"
      />
      <div className="absolute top-3 left-3 bg-purple-600 text-white text-xs px-3 py-1 rounded-full shadow-lg font-semibold tracking-wide opacity-90">
        IPFS
      </div>
    </div>
    <div className="p-5 flex flex-col h-44 justify-between">
      <div>
        <h2 className="text-2xl font-bold mb-2 text-purple-700 dark:text-purple-300 group-hover:text-purple-900 dark:group-hover:text-purple-100 transition-colors duration-300">
          {project.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4">
          {project.description}
        </p>
      </div>
      <a
        href={project.projectUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-auto bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold px-4 py-2 rounded-lg shadow hover:from-purple-700 hover:to-blue-700 transition-colors duration-300 text-center"
      >
        Scopri di più
      </a>
    </div>
  </div>
);

const IPFS_JSON_URL =
  "https://ipfs.io/ipfs/bafkreied7wdlhx6675yed4sqj2qfsryslyyqc4i2n2pavzypdmaoi5dy7i/";

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1️⃣ Stato darkMode: legge localStorage o preferenza di sistema
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") return false;
    return (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  // 2️⃣ Effetto: applica/rimuove la classe .dark e salva in localStorage
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.theme = "dark";
    } else {
      root.classList.remove("dark");
      localStorage.theme = "light";
    }
  }, [darkMode]);

  // 3️⃣ Fetch dei progetti da IPFS
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(IPFS_JSON_URL);
        if (!response.ok)
          throw new Error("Errore nel caricamento dei progetti");
        const data = await response.json();
        setProjects(data.projects || data);
      } catch (err: any) {
        setError(err.message || "Errore sconosciuto");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar sticky */}
      <nav className="sticky top-0 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-purple-100 dark:border-gray-800 shadow-sm py-4 mb-8">
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between px-4">
          <span className="text-2xl font-extrabold text-purple-700 dark:text-purple-300 tracking-tight drop-shadow">
            IPFS Project Showcase
          </span>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500 dark:text-gray-300 font-mono">
              by stephl0xff
            </span>
            <button
              onClick={() => setDarkMode((d) => !d)}
              className="ml-2 p-2 rounded-lg border border-purple-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow hover:bg-purple-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                /* Icona Sole */
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-purple-700 dark:text-purple-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.07l-.71.71M21 12h-1M4 12H3m16.66 6.66l-.71-.71M4.05 4.93l-.71-.71M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                /* Icona Luna */
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-purple-700 dark:text-purple-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Contenuto principale */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-12 text-purple-700 dark:text-purple-200 drop-shadow-lg tracking-tight">
          Il mio Portfolio su IPFS
        </h1>
        {loading && (
          <div className="text-center text-lg text-gray-500 dark:text-gray-300 animate-pulse">
            Caricamento progetti...
          </div>
        )}
        {error && <div className="text-center text-red-500">{error}</div>}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {!loading &&
            !error &&
            projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 py-6 bg-white/80 dark:bg-gray-900/80 border-t border-purple-100 dark:border-gray-800 text-center text-sm text-gray-500 dark:text-gray-300">
        Powered by{" "}
        <span className="font-semibold text-purple-600 dark:text-purple-300">
          React + TailwindCSS
        </span>{" "}
        &middot; Hosted on{" "}
        <span className="font-semibold text-blue-600 dark:text-blue-400">
          IPFS
        </span>
      </footer>
    </div>
  );
};

export default App;
