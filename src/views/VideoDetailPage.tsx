import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { VideoController } from '../controllers/VideoController';
import { Video } from '../types';
import { Home, Plus, BarChart3, User, Play } from 'lucide-react';
import './VideoDetailPage.css';

export const VideoDetailPage = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const navigate = useNavigate();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (videoId) {
      loadVideo();
    }
  }, [videoId]);

  const loadVideo = async () => {
    if (!videoId) return;

    try {
      const videoData = await VideoController.getVideoById(videoId);
      setVideo(videoData);
    } catch (error) {
      console.error('Erro ao carregar vídeo:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="video-detail-page">
        <div className="page-header">
          <h1 className="page-logo">
            Veo<span className="logo-x">X</span>
          </h1>
        </div>
        <div className="page-content">
          <p className="loading-text">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="video-detail-page">
        <div className="page-header">
          <h1 className="page-logo">
            Veo<span className="logo-x">X</span>
          </h1>
        </div>
        <div className="page-content">
          <p className="error-text">Vídeo não encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="video-detail-page">
      <div className="page-header">
        <h1 className="page-logo">
          Veo<span className="logo-x">X</span>
        </h1>
      </div>

      <div className="page-content">
        <h2 className="result-title">
          Seu vídeo<br />
          <span className="result-ready">está pronto!</span>
        </h2>

        <div className="video-preview">
          <div className="video-player">
            {video.status === 'completed' ? (
              <Play size={64} />
            ) : (
              <div className="processing-text">Processando...</div>
            )}
          </div>
          <div className="video-meta">
            <h3 className="video-meta-title">{video.title}</h3>
            <p className="video-meta-description">{video.description}</p>
          </div>
        </div>

        <div className="action-buttons">
          <button className="action-button-outline">Ver variações</button>
          <button className="action-button">Editar</button>
        </div>

        <div className="video-actions">
          <button className="secondary-button" onClick={() => navigate('/dashboard')}>
            Voltar ao Dashboard
          </button>
          <button className="secondary-button" onClick={() => navigate('/criar-video')}>
            Criar Novo Vídeo
          </button>
        </div>
      </div>

      <nav className="bottom-nav">
        <button className="nav-button" onClick={() => navigate('/dashboard')}>
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
