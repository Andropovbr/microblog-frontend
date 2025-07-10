import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Usamos um 'try...catch' para lidar com possíveis erros de rede
    const fetchPosts = async () => {
      try {
        // O frontend chama o endpoint relativo. O ALB irá rotear para o serviço correto.
        const response = await fetch('/api/posts');
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []); // O array vazio [] garante que este efeito corre apenas uma vez

  return (
    <div className="App">
      <header className="App-header">
        <h1>Microblog IaC com Terraform & AWS</h1>
        <p>Uma arquitetura de microsserviços completa com CI/CD.</p>
      </header>
      <main className="App-content">
        <h2>Últimos Posts</h2>
        {loading && <p>A carregar posts...</p>}
        {error && <p className="error">Erro ao carregar posts: {error}</p>}
        <div className="posts-container">
          {posts.map(post => (
            <div key={post.id} className="post-card">
              <h3>{post.title}</h3>
              <p>{post.content}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;