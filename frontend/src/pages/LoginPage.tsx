import { useNavigate } from 'react-router-dom';
import { ImprovedLogin } from '../components/auth/ImprovedLogin';

export function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/app');
  };

  return <ImprovedLogin onLogin={handleLogin} />;
}
