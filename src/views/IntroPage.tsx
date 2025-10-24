import { useNavigate } from 'react-router-dom';
import './IntroPage.css';

export const IntroPage = () => {
  const navigate = useNavigate();

  return (
    <div className="intro-page">
      <div className="intro-container">
        <div className="logo-box">
          <h1 className="logo-text">
            Veo<span className="logo-x">X</span>
          </h1>
          <p className="tagline">Faça parte dessa experiência.</p>
        </div>
        <button
          className="start-button"
          onClick={() => navigate('/login')}
        >
          Começar
        </button>
      </div>
      <div className="footer-logo">
        Veo<span className="logo-x">X</span>
        <div className="footer-year">© 2025</div>
      </div>
    </div>
  );
};
