import { useNavigate } from 'react-router-dom';
import { MFA } from '../components/auth/MFA';

export function MFAPage() {
  const navigate = useNavigate();

  const handleVerify = () => {
    // Redireciona para a aplicação após verificação MFA
    navigate('/app');
  };

  return <MFA onVerify={handleVerify} />;
}
