import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/auth/AuthForm.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    const form = new FormData(event.currentTarget);
    try {
      await register({ name: form.get('name'), email: form.get('email'), password: form.get('password') });
      navigate('/app/dashboard');
    } catch (authError) {
      setError(authError.message);
    } finally {
      setLoading(false);
    }
  };

  return <div className="grid min-h-screen place-items-center px-4"><AuthForm mode="register" onSubmit={handleSubmit} error={error} loading={loading} /></div>;
}
