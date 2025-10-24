import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthController } from '../controllers/AuthController';
import './AuthPages.css';

export const SignupPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await AuthController.signUp(email, password, username);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1 className="auth-logo">
          Veo<span className="logo-x">X</span>
        </h1>

        <h2 className="auth-title">Cadastro</h2>

        <form onSubmit={handleSignup} className="auth-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="Nome de usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Criando conta...' : 'Cadastrar-se'}
          </button>

          <p className="auth-link">
            Já possui uma conta?{' '}
            <span onClick={() => navigate('/login')} className="link">
              Faça o login
            </span>
          </p>
        </form>
      </div>

      <div className="footer-logo">
        Veo<span className="logo-x">X</span>
        <div className="footer-year">© 2025</div>
      </div>
    </div>
  );
};
