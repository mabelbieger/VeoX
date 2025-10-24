import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfileController } from '../controllers/ProfileController';
import { AuthController } from '../controllers/AuthController';
import { useAuth } from '../hooks/useAuth';
import { UserProfile } from '../types';
import { Home, Plus, BarChart3, User } from 'lucide-react';
import './ProfilePage.css';

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    company_area: '',
    target_audience: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const profileData = await ProfileController.getProfile(user.id);
      if (profileData) {
        setProfile(profileData);
        setFormData({
          company_name: profileData.company_name || '',
          company_area: profileData.company_area || '',
          target_audience: profileData.target_audience || '',
        });
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      await ProfileController.updateProfile(user.id, formData);
      await loadProfile();
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      alert('Erro ao salvar alterações');
    }
  };

  const handleLogout = async () => {
    try {
      await AuthController.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
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

  return (
    <div className="profile-page">
      <div className="page-header">
        <h1 className="page-logo">
          Veo<span className="logo-x">X</span>
        </h1>
      </div>

      <div className="page-content">
        <div className="profile-header">
          <div className="avatar">
            <User size={48} />
          </div>
          <h2 className="profile-name">{profile?.username || 'Usuário'}</h2>
          <p className="profile-email">{user?.email}</p>
        </div>

        <div className="plan-badge">
          <span className="plan-status">Gratuito</span>
          <button className="upgrade-button">Mudar plano</button>
        </div>

        <div className="profile-section">
          <h3 className="section-title">Sobre sua empresa/marca</h3>

          {isEditing ? (
            <div className="edit-form">
              <div className="form-group">
                <label className="form-label">Nome da empresa ou marca</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  placeholder="Ex: WePink"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Área de atuação</label>
                <select
                  className="form-select"
                  value={formData.company_area}
                  onChange={(e) => setFormData({ ...formData, company_area: e.target.value })}
                >
                  <option value="">Selecione</option>
                  <option value="Beleza">Beleza</option>
                  <option value="Moda">Moda</option>
                  <option value="Tecnologia">Tecnologia</option>
                  <option value="Alimentação">Alimentação</option>
                  <option value="Serviços">Serviços</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Descrição rápida</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.target_audience}
                  onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
                  placeholder="Ex: Mulheres de 18 a 30 anos"
                />
              </div>
            </div>
          ) : (
            <div className="profile-info">
              <div className="info-item">
                <span className="info-label">Nome da empresa ou marca</span>
                <span className="info-value">{profile?.company_name || 'Não informado'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Área de atuação</span>
                <span className="info-value">{profile?.company_area || 'Não informado'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Descrição rápida</span>
                <span className="info-value">{profile?.target_audience || 'Não informado'}</span>
              </div>
            </div>
          )}

          <button
            className="save-button"
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
          >
            {isEditing ? 'Salvar alterações' : 'Editar perfil'}
          </button>

          {isEditing && (
            <button
              className="cancel-button"
              onClick={() => {
                setIsEditing(false);
                if (profile) {
                  setFormData({
                    company_name: profile.company_name || '',
                    company_area: profile.company_area || '',
                    target_audience: profile.target_audience || '',
                  });
                }
              }}
            >
              Cancelar
            </button>
          )}
        </div>

        <button className="logout-button" onClick={handleLogout}>
          Sair da conta
        </button>
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
        <button className="nav-button active" onClick={() => navigate('/perfil')}>
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
