import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { VideoController } from '../controllers/VideoController';
import { useAuth } from '../hooks/useAuth';
import { Home, Plus, BarChart3, User } from 'lucide-react';
import './AnalyticsPage.css';

export const AnalyticsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('week');

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    try {
      const videosData = await VideoController.getUserVideos(user.id);
      setVideos(videosData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const mockAnalytics = {
    totalViews: 7450,
    totalLikes: 320,
    totalComments: 43,
    weeklyData: [
      { day: 'Dom', views: 650 },
      { day: 'Seg', views: 720 },
      { day: 'Ter', views: 580 },
      { day: 'Qua', views: 690 },
      { day: 'Qui', views: 710 },
      { day: 'Sex', views: 750 },
      { day: 'Sab', views: 800 },
    ],
    campaigns: [
      { name: 'Obsessed', views: 4500, engagement: '7.5%' },
      { name: 'Body Splash RED', views: 2950, engagement: '6.2%' },
    ],
    demographics: {
      male: 35,
      female: 65,
      ages: {
        '18-24': 18,
        '25-34': 25,
        '45-54': 45,
      },
    },
  };

  const maxViews = Math.max(...mockAnalytics.weeklyData.map(d => d.views));

  return (
    <div className="analytics-page">
      <div className="page-header">
        <h1 className="page-logo">
          Veo<span className="logo-x">X</span>
        </h1>
      </div>

      <div className="page-content">
        <div className="analytics-header">
          <h2 className="section-title">Análises</h2>
          <select
            className="period-select"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="week">Semana</option>
            <option value="month">Mês</option>
            <option value="year">Ano</option>
          </select>
        </div>

        <div className="overview-section">
          <h3 className="subsection-title">Visão geral</h3>

          <div className="chart-container">
            <div className="chart">
              {mockAnalytics.weeklyData.map((data, index) => (
                <div key={index} className="chart-bar-wrapper">
                  <div
                    className="chart-bar"
                    style={{ height: `${(data.views / maxViews) * 100}%` }}
                  />
                  <span className="chart-label">{data.day}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Visualizações</div>
              <div className="stat-value">{mockAnalytics.totalViews.toLocaleString()}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Likes</div>
              <div className="stat-value">{mockAnalytics.totalLikes}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Comentários</div>
              <div className="stat-value">{mockAnalytics.totalComments}</div>
            </div>
          </div>
        </div>

        <div className="campaigns-section">
          <h3 className="subsection-title">Principais campanhas</h3>
          <div className="campaigns-table">
            <div className="table-header">
              <span>Campanha</span>
              <span>Visualizações</span>
              <span>Engajamento</span>
            </div>
            {mockAnalytics.campaigns.map((campaign, index) => (
              <div key={index} className="table-row">
                <span>{campaign.name}</span>
                <span>{campaign.views.toLocaleString()}</span>
                <span>{campaign.engagement}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="demographics-section">
          <h3 className="subsection-title">Demografia</h3>
          <div className="demographics-grid">
            <div className="demo-card">
              <h4 className="demo-title">Sexo</h4>
              <div className="gender-bars">
                <div className="gender-bar-wrapper">
                  <span className="gender-label">♂</span>
                  <div className="gender-bar-bg">
                    <div
                      className="gender-bar male"
                      style={{ width: `${mockAnalytics.demographics.male}%` }}
                    />
                  </div>
                </div>
                <div className="gender-bar-wrapper">
                  <span className="gender-label">♀</span>
                  <div className="gender-bar-bg">
                    <div
                      className="gender-bar female"
                      style={{ width: `${mockAnalytics.demographics.female}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="demo-card">
              <h4 className="demo-title">Idade</h4>
              <div className="age-distribution">
                {Object.entries(mockAnalytics.demographics.ages).map(([range, percentage]) => (
                  <div key={range} className="age-item">
                    <span className="age-range">{range}</span>
                    <div className="age-bar-bg">
                      <div
                        className="age-bar"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="age-percentage">{percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <nav className="bottom-nav">
        <button className="nav-button" onClick={() => navigate('/dashboard')}>
          <Home size={24} />
        </button>
        <button className="nav-button" onClick={() => navigate('/criar-video')}>
          <Plus size={24} />
        </button>
        <button className="nav-button active" onClick={() => navigate('/analises')}>
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
