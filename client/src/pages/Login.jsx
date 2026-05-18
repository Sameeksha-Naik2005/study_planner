import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthForm from '../components/auth/AuthForm.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    const form = new FormData(event.currentTarget);
    try {
      await login({ email: form.get('email'), password: form.get('password') });
      navigate(location.state?.from?.pathname || '/app/dashboard');
    } catch (authError) {
      setError(authError.message);
    } finally {
      setLoading(false);
    }
  };

  return <div className="grid min-h-screen place-items-center px-4"><AuthForm mode="login" onSubmit={handleSubmit} error={error} loading={loading} /></div>;
}
