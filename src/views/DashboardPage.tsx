import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { VideoController } from '../controllers/VideoController';
import { ProfileController } from '../controllers/ProfileController';
import { useAuth } from '../hooks/useAuth';
import { Video } from '../types';
import { Play, Home, Plus, BarChart3, User } from 'lucide-react';
import './DashboardPage.css';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [videos, setVideos] = useState<Video[]>([]);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    try {
      const [videosData, profileData] = await Promise.all([
        VideoController.getUserVideos(user.id),
        ProfileController.getProfile(user.id),
      ]);

      setVideos(videosData);
      setUsername(profileData?.username || 'Usuário');
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1 className="dashboard-logo">
          Veo<span className="logo-x">X</span>
        </h1>
      </div>

      <div className="dashboard-content">
        <h2 className="welcome-text">
          Olá, {username}
        </h2>

        <button
          className="create-button"
          onClick={() => navigate('/criar-video')}
        >
          <Plus size={24} />
          Criar propaganda
        </button>

        <div className="videos-section">
          <h3 className="section-title">Suas propagandas</h3>

          {loading ? (
            <p className="loading-text">Carregando...</p>
          ) : videos.length === 0 ? (
            <p className="empty-text">Nenhum vídeo criado ainda</p>
          ) : (
            <div className="videos-grid">
              {videos.map((video) => (
                <div key={video.id} className="video-card">
                  <div className="video-thumbnail">
                    <Play size={48} />
                  </div>
                  <div className="video-info">
                    <h4 className="video-title">{video.title}</h4>
                    <button
                      className="view-button"
                      onClick={() => navigate(`/video/${video.id}`)}
                    >
                      Ver
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="tips-section">
          <h3 className="tips-title">VeoX Tips</h3>
          <div className="tip-card">
            <h4 className="tip-title">Sugestões de slogan</h4>
            <p className="tip-text">
              Realce o poder feminino com slogans criativos como: 'Sua beleza, sua escolha' ou 'Autenticidade que brilha'
            </p>
            <button className="tip-button">Gere mais ideias com a IA!</button>
          </div>

          <div className="tip-card">
            <h4 className="tip-title">Tendências da semana</h4>
            <p className="tip-text">
              Nesta semana, tons rosados vibrantes, vídeos com luzes suaves e hashtags como #GlowUp estão em alta. Use isso nas suas campanhas da WePink!
            </p>
          </div>

          <div className="tip-card">
            <h4 className="tip-title">Formato ideal para o seu público</h4>
            <p className="tip-text">
              Para o público jovem e fashion da WePink, vídeos estilo Reels com trilha sonora do momento têm maior engajamento. Aposte também em carrosséis com dicas rápidas de beleza!
            </p>
          </div>
        </div>
      </div>

      <nav className="bottom-nav">
        <button className="nav-button active" onClick={() => navigate('/dashboard')}>
          <Home size={24} />
        </button>
        <button className="nav-button" onClick={() => navigate('/criar-video')}>
          <Plus size={24} />
        </button>
        <button className="nav-button" onClick={() => navigate('/analises')}>
          <BarChart3 size={24} />
        </button>
        <button className="nav-button" onClick={() => navigate('/perfil')}>
          <User size={24} />
        </button>
      </nav>

      <div className="footer-logo-small">
        Veo<span className="logo-x">X</span>
        <div className="footer-year">© 2025</div>
      </div>
    </div>
  );
};
