import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VideoController } from '../controllers/VideoController';
import { useAuth } from '../hooks/useAuth';
import { Home, Plus, BarChart3, User } from 'lucide-react';
import './CreateVideoPage.css';

export const CreateVideoPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    description: '',
    platform: 'tiktok' as 'tiktok' | 'reels' | 'shorts',
    objective: 'Lançamento de produto',
    target_audience: '',
    tone: 'Divertido, Criativo',
    language: 'Português (Brasil)',
    duration: 30,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const video = await VideoController.createVideo(user.id, formData);
      navigate(`/video/${video.id}`);
    } catch (error) {
      console.error('Erro ao criar vídeo:', error);
      alert('Erro ao criar vídeo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-video-page">
      <div className="page-header">
        <h1 className="page-logo">
          Veo<span className="logo-x">X</span>
        </h1>
      </div>

      <div className="page-content">
        <h2 className="page-title">Descreva a sua propaganda</h2>

        <form onSubmit={handleSubmit} className="video-form">
          <div className="form-section">
            <textarea
              className="description-input"
              placeholder="Ex: Lançamento do novo Body Splash da WePink"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={3}
            />
          </div>

          <div className="form-section">
            <label className="form-label">Escolha a plataforma</label>
            <select
              className="form-select"
              value={formData.platform}
              onChange={(e) => setFormData({ ...formData, platform: e.target.value as any })}
            >
              <option value="tiktok">TikTok</option>
              <option value="reels">Instagram Reels</option>
              <option value="shorts">YouTube Shorts</option>
            </select>
          </div>

          <div className="form-section">
            <label className="form-label">Objetivo da propaganda</label>
            <select
              className="form-select"
              value={formData.objective}
              onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
            >
              <option value="Lançamento de produto">Lançamento de produto</option>
              <option value="Promoção">Promoção</option>
              <option value="Branding">Branding</option>
              <option value="Engajamento">Engajamento</option>
            </select>
          </div>

          <div className="form-section">
            <label className="form-label">Público alvo</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ex: Mulheres de 18 a 30 anos"
              value={formData.target_audience}
              onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
            />
          </div>

          <div className="form-section">
            <label className="form-label">Tom de comunicação</label>
            <select
              className="form-select"
              value={formData.tone}
              onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
            >
              <option value="Divertido, Criativo">Divertido, Criativo</option>
              <option value="Sério, Profissional">Sério, Profissional</option>
              <option value="Inspirador, Motivacional">Inspirador, Motivacional</option>
              <option value="Casual, Amigável">Casual, Amigável</option>
            </select>
          </div>

          <div className="form-section">
            <label className="form-label">Idioma</label>
            <select
              className="form-select"
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value })}
            >
              <option value="Português (Brasil)">Português (Brasil)</option>
              <option value="Inglês">Inglês</option>
              <option value="Espanhol">Espanhol</option>
            </select>
          </div>

          <div className="form-section">
            <label className="form-label">Duração do vídeo</label>
            <select
              className="form-select"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
            >
              <option value={15}>15 segundos</option>
              <option value={30}>30 segundos</option>
              <option value={60}>60 segundos</option>
            </select>
          </div>

          <button
            type="submit"
            className="generate-button"
            disabled={loading || !formData.description}
          >
            {loading ? 'Gerando...' : 'Gerar com o VeoX'}
          </button>
        </form>
      </div>

      <nav className="bottom-nav">
        <button className="nav-button" onClick={() => navigate('/dashboard')}>
          <Home size={24} />
        </button>
        <button className="nav-button active" onClick={() => navigate('/criar-video')}>
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
