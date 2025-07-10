import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // NOVO: Estados para controlar os campos do formulário
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');

  const fetchPosts = async () => {
    try {
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

  useEffect(() => {
    fetchPosts();
  }, []);

  // NOVO: Função para lidar com a submissão do formulário
  const handlePostSubmit = async (event) => {
    event.preventDefault(); // Impede o recarregamento da página

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newPostTitle, content: newPostContent }),
      });

      if (!response.ok) {
        throw new Error('Falha ao criar o post');
      }

      // Limpa os campos do formulário e recarrega os posts
      setNewPostTitle('');
      setNewPostContent('');
      fetchPosts(); // Recarrega a lista para mostrar o novo post

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Microblog IaC com Terraform & AWS</h1>
        <p>Uma arquitetura de microsserviços completa com CI/CD.</p>
      </header>
      <main className="App-content">
        
        {/* NOVO: Formulário de criação de post */}
        <div className="form-container">
          <h2>Criar Novo Post</h2>
          <form onSubmit={handlePostSubmit}>
            <input
              type="text"
              placeholder="Título do Post"
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
              required
            />
            <textarea
              placeholder="O que está a acontecer?"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              required
            />
            <button type="submit">Publicar</button>
          </form>
        </div>

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
