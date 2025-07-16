import React, { useEffect, useState } from "react";

// Interfaccia per un progetto
interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string; // URL immagine su IPFS
  projectUrl: string; // URL progetto su IPFS
}

// Componente per la card del progetto
const ProjectCard: React.FC<{ project: Project }> = ({ project }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:scale-105 transition-transform border border-gray-200">
    <a href={project.projectUrl} target="_blank" rel="noopener noreferrer">
      <img
        src={project.imageUrl}
        alt={project.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
        <p className="text-gray-600 text-sm">{project.description}</p>
      </div>
    </a>
  </div>
);

const IPFS_JSON_URL =
  "https://ipfs.io/ipfs/bafkreied7wdlhx6675yed4sqj2qfsryslyyqc4i2n2pavzypdmaoi5dy7i/"; // Sostituisci con il tuo hash JSON

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(IPFS_JSON_URL);
        if (!response.ok)
          throw new Error("Errore nel caricamento dei progetti");
        const data = await response.json();
        setProjects(data.projects || data); // accetta sia {projects: [...]} che array diretto
      } catch (err: any) {
        setError(err.message || "Errore sconosciuto");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-10 px-4">
      <h1 className="text-4xl font-bold text-center mb-10 text-purple-700 drop-shadow">
        Il mio Portfolio su IPFS
      </h1>
      {loading && (
        <div className="text-center text-lg text-gray-500">
          Caricamento progetti...
        </div>
      )}
      {error && <div className="text-center text-red-500">{error}</div>}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {!loading &&
          !error &&
          projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
      </div>
    </div>
  );
};

export default App;
